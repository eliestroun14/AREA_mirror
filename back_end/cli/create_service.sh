#!/usr/bin/env bash

## ====================================================
##                      HEADER
## ====================================================
COL_OK="\e[32m"
COL_KO="\e[31m"
COL_RS="\e[0m"

if [ -z "$1" ]; then
  echo -e "Usage: $0 service-name";
  exit 1;
fi

if [[ ! $1 =~ ^[a-z-]+$ ]]; then
  echo -e "Invalid service-name format ($1): Only lowercase characters and '-' are allowed.";
  exit 1
fi

service__name=$1

# Set the root_dir variable
find_root_path() {
  target=".git"
  dir=$(pwd)
  while [ "$dir" != "/" ]; do
    if [ -d "$dir/$target" ]; then
      root_dir="$dir" # Do not include $target as we want the directory where the .git is, and not the .git itself
      break
    fi
    dir="$(dirname "$dir")"
  done

  if [ "$dir" == "/" ]; then
    echo -e "$COL_KO""[Error]""$COL_RS"" Project root folder not found.";
    exit 1;
  fi
}
find_root_path

## ====================================================
##                      SCRIPT
## ====================================================

function create_file() {
  file_extension=$1
  placeholderFile="$2/$file_extension.ts.placeholder"
  serviceFile="$3/$service__name.$file_extension.ts"
  echo -ne "$COL_OK""[+]$COL_RS Generating file $serviceFile ..."
  cp "$placeholderFile" "$serviceFile" \
    || (echo -e "$COL_KO"" KO""$COL_RS""\n""$COL_KO""[ERROR]""$COL_RS""File not found: $placeholderFile" && exit 1)

  sed -i "$serviceFile"                       \
     -e "s/<ServiceName>/$ServiceName/g"      \
     -e "s/<serviceName>/$serviceName/g"      \
     -e "s/<service-name>/$service__name/g"   \
     -e "s/<service_name>/$service_name/g"
  echo -e "$COL_KO"" OK""$COL_RS"
}

service_name=$(echo "$service__name" | sed 's/-/_/g')
serviceName=$(echo "$service__name" | sed 's/.*/\L&/' | sed -E ':a; s/-([a-z])/\U\1/g; ta')
ServiceName=$(echo "$service__name" | sed 's/.*/\L&/' | sed -E ':a; s/-([a-z])/\U\1/g; ta' | sed 's/^./\U&/')

placeholderDirectory="$root_dir/back_end/cli/assets"
serviceDirectory="$root_dir/back_end/src/services/$service__name"

if [[ -d "$serviceDirectory" ]]; then
  echo -e "$COL_KO""[ERROR]""$COL_RS"" This service already exists.";
  exit 1;
fi

echo -ne "$COL_OK""[+]""$COL_RS"" Creating service directory $serviceDirectory/oauth2 ..."
mkdir -p "$serviceDirectory/oauth2"     \
  && echo -e "$COL_OK"" OK""$COL_RS"    \
  || (echo -ne "$COL_KO"" KO""$COLOR_RS""\n""$COL_KO""[ERROR]""$COL_RS""Cannot create directory ""$serviceDirectory""/." && exit 1)

create_file data "$placeholderDirectory/service" "$serviceDirectory"
create_file controller "$placeholderDirectory/oauth2-service" "$serviceDirectory/oauth2"
create_file guard "$placeholderDirectory/oauth2-service" "$serviceDirectory/oauth2"
create_file module "$placeholderDirectory/oauth2-service" "$serviceDirectory/oauth2"
create_file strategy "$placeholderDirectory/oauth2-service" "$serviceDirectory/oauth2"
