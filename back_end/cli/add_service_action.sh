#!/usr/bin/env bash

## ====================================================
##                      HEADER
## ====================================================
COL_OK="\e[32m"
COL_KO="\e[31m"
COL_RS="\e[0m"

if [ -z "$1" ]; then
  echo -e "Usage: $0 service-name action-name 'Action title' 'Action description'";
  exit 1;
fi

if [[ $# != 4 ]]; then
  echo -e "Invalid number of arguments.\n";
  echo -e "Usage: $0 service-name action-name 'Action title' 'Action description'";
  exit 1
fi

if [[ ! $1 =~ ^[a-z-]+$ ]]; then
  echo -e "Invalid format ($1): Only lowercase characters and '-' are allowed.";
  exit 1
fi

if [[ ! $2 =~ ^[a-z-]+$ ]]; then
  echo -e "Invalid service-name format ($2): Only lowercase characters and '-' are allowed.";
  exit 1
fi

service__name=$1
action__name=$2
action__title=$3
action__description=$4

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
  placeholderFile="$placeholderDirectory/$file_extension.ts.placeholder"
  file="$actionDirectory/$service__name-$action__name.$file_extension.ts"
  echo -ne "$COL_OK""[+]$COL_RS Generating file $file ..."
  cp "$placeholderFile" "$file" \
    || (echo -e "$COL_KO"" KO""$COL_RS""\n""$COL_KO""[ERROR]""$COL_RS""File not found: $placeholderFile" && exit 1)

  sed -i "$file"                                            \
     -e "s/<ServiceName>/$ServiceName/g"                    \
     -e "s/<serviceName>/$serviceName/g"                    \
     -e "s/<service-name>/$service__name/g"                 \
     -e "s/<service_name>/$service_name/g"                  \
                                                            \
     -e "s/<ActionName>/$ActionName/g"                    \
     -e "s/<actionName>/$actionName/g"                    \
     -e "s/<action-name>/$action__name/g"                 \
     -e "s/<action_name>/$action_name/g"                  \
                                                            \
     -e "s/<ActionTitle>/$action__title/g"                \
     -e "s/<ActionDescription>/$action__description/g"

  echo -e "$COL_KO"" OK""$COL_RS"
}

service_name=$(echo "$service__name" | sed 's/-/_/g')
serviceName=$(echo "$service__name" | sed 's/.*/\L&/' | sed -E ':a; s/-([a-z])/\U\1/g; ta')
ServiceName=$(echo "$service__name" | sed 's/.*/\L&/' | sed -E ':a; s/-([a-z])/\U\1/g; ta' | sed 's/^./\U&/')

action_name=$(echo "$action__name" | sed 's/-/_/g')
actionName=$(echo "$action__name" | sed 's/.*/\L&/' | sed -E ':a; s/-([a-z])/\U\1/g; ta')
ActionName=$(echo "$action__name" | sed 's/.*/\L&/' | sed -E ':a; s/-([a-z])/\U\1/g; ta' | sed 's/^./\U&/')

placeholderDirectory="$root_dir/back_end/cli/assets/action-service"
serviceDirectory="$root_dir/back_end/src/services/$service__name"
actionDirectory="$serviceDirectory/actions/$action__name"

if [[ ! -d $serviceDirectory ]]; then
  echo -e "$COL_KO""[ERROR]""$COL_RS"" This service do not exists.";
  exit 1;
fi

if [[ ! -d $actionDirectory ]]; then
  echo -ne "$COL_OK""[+]""$COL_RS"" Creating directory $actionDirectory ..."
  mkdir -p "$actionDirectory"             \
    && echo -e "$COL_OK"" OK""$COL_RS"    \
    || (echo -ne "$COL_KO"" KO""$COLOR_RS""\n""$COL_KO""[ERROR]""$COL_RS""Cannot create directory ""$actionDirectory""/." && exit 1)
fi

create_file data
create_file dto
create_file poll
