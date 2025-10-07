#!/bin/bash

# Script pour exécuter tous les tests des modules principaux avec couverture
# Modules: aboutJson, auth, oauth2, services, users, zaps

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}  Exécution des tests automatisés - Backend${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Fonction pour afficher un séparateur
separator() {
    echo ""
    echo -e "${YELLOW}------------------------------------------------${NC}"
    echo ""
}

# Variable pour compter les succès et échecs
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_MODULES=()

# Fonction pour exécuter les tests d'un module
run_module_tests() {
    local module_name=$1
    local test_pattern=$2
    
    echo -e "${BLUE}🧪 Test du module: ${module_name}${NC}"
    echo ""
    
    # Sauvegarder la sortie complète dans un fichier temporaire
    local temp_file="/tmp/test_${module_name}_$$.txt"
    
    if npm test -- --testPathPatterns="${test_pattern}" --coverage --verbose 2>&1 | tee "$temp_file"; then
        echo -e "${GREEN}✅ ${module_name} - Tests réussis${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        rm -f "$temp_file"
    else
        echo -e "${RED}❌ ${module_name} - Tests échoués${NC}"
        FAILED_MODULES+=("$module_name")
        
        # Extraire et afficher les erreurs
        echo ""
        echo -e "${RED}Détails des erreurs pour ${module_name}:${NC}"
        grep -A 10 "FAIL\|●" "$temp_file" | head -50 || true
        
        # Garder le fichier pour analyse ultérieure
        echo -e "${YELLOW}Détails complets sauvegardés dans: $temp_file${NC}"
    fi
    
    separator
}

# Exécution des tests pour chaque module
echo -e "${YELLOW}Démarrage des tests...${NC}"
separator

run_module_tests "AboutJson" "aboutJson"
run_module_tests "Auth" "auth"
run_module_tests "OAuth2" "oauth2"
run_module_tests "Services" "services"
run_module_tests "Users" "users"
run_module_tests "Webhooks" "webhooks"
run_module_tests "Zaps" "zaps"

TOTAL_TESTS=7

# Résumé final
echo ""
echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}           RÉSUMÉ DES TESTS${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""
echo -e "Total de modules testés: ${TOTAL_TESTS}"
echo -e "${GREEN}Modules réussis: ${PASSED_TESTS}${NC}"
echo -e "${RED}Modules échoués: $((TOTAL_TESTS - PASSED_TESTS))${NC}"

if [ ${#FAILED_MODULES[@]} -gt 0 ]; then
    echo ""
    echo -e "${RED}Modules avec des échecs:${NC}"
    for module in "${FAILED_MODULES[@]}"; do
        echo -e "${RED}  - ${module}${NC}"
    done
    echo ""
    echo -e "${YELLOW}💡 Conseil: Consultez les fichiers /tmp/test_*.txt pour plus de détails${NC}"
    echo ""
    echo -e "${BLUE}📊 Génération du rapport de couverture global malgré les échecs...${NC}"
    echo ""
    npm test -- --coverage --watchAll=false 2>&1 | grep -A 100 "Test Suites:" | head -60 || true
    exit 1
else
    echo ""
    echo -e "${GREEN}🎉 Tous les modules ont passé leurs tests!${NC}"
    echo ""
    
    # Générer le rapport de couverture global
    echo -e "${BLUE}📊 Génération du rapport de couverture global...${NC}"
    echo ""
    
    # Exécuter tous les tests et capturer le résultat dans un fichier temporaire
    TEMP_OUTPUT="/tmp/global_test_output_$$.txt"
    npm test -- --coverage --watchAll=false > "$TEMP_OUTPUT" 2>&1
    GLOBAL_EXIT_CODE=$?
    
    # Afficher le résumé des tests
    grep -A 3 "Test Suites:" "$TEMP_OUTPUT" || true
    echo ""
    
    # Afficher la couverture globale (ligne "All files")
    echo -e "${BLUE}Couverture globale:${NC}"
    grep "All files" "$TEMP_OUTPUT" || true
    echo ""
    
    # Vérifier s'il y a des échecs dans le rapport global
    if grep -q "FAIL" "$TEMP_OUTPUT" || [ $GLOBAL_EXIT_CODE -ne 0 ]; then
        echo -e "${RED}⚠️  Attention: Des tests ont échoué lors de l'exécution globale!${NC}"
        echo ""
        echo -e "${YELLOW}Détails des tests échoués:${NC}"
        grep -B 5 -A 15 "FAIL\|●.*✕" "$TEMP_OUTPUT" | head -100
        echo ""
        echo -e "${YELLOW}💡 Conseil: Un test peut passer individuellement mais échouer avec les autres${NC}"
        echo -e "${YELLOW}   (problèmes de mocks, états partagés, etc.)${NC}"
        echo ""
        echo -e "${YELLOW}Rapport complet sauvegardé dans: $TEMP_OUTPUT${NC}"
        exit 1
    fi
    
    # Nettoyer le fichier temporaire
    rm -f "$TEMP_OUTPUT"
    
    echo -e "${GREEN}✅ Tous les tests sont passés avec succès!${NC}"
    exit 0
fi
