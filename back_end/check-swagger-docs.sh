#!/bin/bash

# Script pour vérifier quels DTOs ne sont pas encore documentés avec Swagger

echo "🔍 Recherche des DTOs non documentés avec Swagger..."
echo ""

# Rechercher tous les fichiers .dto.ts
dto_files=$(find src -name "*.dto.ts" -type f)

total=0
undocumented=0

for file in $dto_files; do
  total=$((total + 1))
  
  # Vérifier si le fichier contient @ApiProperty
  if ! grep -q "@ApiProperty" "$file"; then
    undocumented=$((undocumented + 1))
    echo "❌ Non documenté: $file"
  else
    echo "✅ Documenté: $file"
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Résumé:"
echo "   Total de DTOs: $total"
echo "   Documentés: $((total - undocumented))"
echo "   Non documentés: $undocumented"
echo ""

if [ $undocumented -eq 0 ]; then
  echo "🎉 Tous vos DTOs sont documentés avec Swagger!"
else
  echo "⚠️  Il reste $undocumented DTOs à documenter"
  echo ""
  echo "💡 Pour documenter un DTO, ajoutez @ApiProperty() à chaque propriété:"
  echo ""
  echo "   import { ApiProperty } from '@nestjs/swagger';"
  echo ""
  echo "   export class MyDto {"
  echo "     @ApiProperty({ description: 'Description', example: 'Exemple' })"
  echo "     @IsString()"
  echo "     property: string;"
  echo "   }"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
