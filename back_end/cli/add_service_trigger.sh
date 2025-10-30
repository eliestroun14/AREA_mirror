#!/usr/bin/env bash

## ====================================================
##                      HEADER
## ====================================================
COL_OK="\e[32m"
COL_KO="\e[31m"
COL_RS="\e[0m"

if [ -z "$1" ]; then
  echo -e "Usage: $0 trigger-type service-name trigger-name 'Trigger title' 'Trigger description'";
  exit 1;
fi

if [[ $# != 5 ]]; then
  echo -e "Invalid number of arguments.\n";
  echo -e "Usage: $0 trigger-type service-name trigger-name 'Trigger title' 'Trigger description'";
  exit 1
fi

if [[ ! $1 =~ ^[a-z-]+$ ]]; then
  echo -e "Invalid trigger-type format ($1): Only lowercase characters and '-' are allowed.";
  exit 1
fi

if [[ ! $2 =~ ^[a-z-]+$ ]]; then
  echo -e "Invalid service-name format ($2): Only lowercase characters and '-' are allowed.";
  exit 1
fi

if [[ ! $3 =~ ^[a-z-]+$ ]]; then
  echo -e "Invalid trigger-name format ($3): Only lowercase characters and '-' are allowed.";
  exit 1
fi

trigger__type=$1
service__name=$2
trigger__name=$3
trigger__title=$4
trigger__description=$5

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
  file="$triggerDirectory/$service__name-$trigger__name.$file_extension.ts"
  echo -ne "$COL_OK""[+]$COL_RS Generating file $file ..."
  cp "$placeholderFile" "$file" \
    || (echo -e "$COL_KO"" KO""$COL_RS""\n""$COL_KO""[ERROR]""$COL_RS""File not found: $placeholderFile" && exit 1)

  sed -i "$file"                                            \
     -e "s/<ServiceName>/$ServiceName/g"                    \
     -e "s/<serviceName>/$serviceName/g"                    \
     -e "s/<service-name>/$service__name/g"                 \
     -e "s/<service_name>/$service_name/g"                  \
                                                            \
     -e "s/<TriggerName>/$TriggerName/g"                    \
     -e "s/<triggerName>/$triggerName/g"                    \
     -e "s/<trigger-name>/$trigger__name/g"                 \
     -e "s/<trigger_name>/$trigger_name/g"                  \
                                                            \
     -e "s/<TriggerTitle>/$trigger__title/g"                \
     -e "s/<TriggerDescription>/$trigger__description/g"

  echo -e "$COL_KO"" OK""$COL_RS"
}

service_name=$(echo "$service__name" | sed 's/-/_/g')
serviceName=$(echo "$service__name" | sed 's/.*/\L&/' | sed -E ':a; s/-([a-z])/\U\1/g; ta')
ServiceName=$(echo "$service__name" | sed 's/.*/\L&/' | sed -E ':a; s/-([a-z])/\U\1/g; ta' | sed 's/^./\U&/')

trigger_name=$(echo "$trigger__name" | sed 's/-/_/g')
triggerName=$(echo "$trigger__name" | sed 's/.*/\L&/' | sed -E ':a; s/-([a-z])/\U\1/g; ta')
TriggerName=$(echo "$trigger__name" | sed 's/.*/\L&/' | sed -E ':a; s/-([a-z])/\U\1/g; ta' | sed 's/^./\U&/')

placeholderDirectory="$root_dir/back_end/cli/assets/trigger-$trigger__type-service"
serviceDirectory="$root_dir/back_end/src/services/$service__name"
triggerDirectory="$serviceDirectory/triggers/$trigger__name"

if [[ ! -d $serviceDirectory ]]; then
  echo -e "$COL_KO""[ERROR]""$COL_RS"" This service do not exists.";
  exit 1;
fi

if [[ ! -d $triggerDirectory ]]; then
  echo -ne "$COL_OK""[+]""$COL_RS"" Creating directory $triggerDirectory ..."
  mkdir -p "$triggerDirectory"            \
    && echo -e "$COL_OK"" OK""$COL_RS"    \
    || (echo -ne "$COL_KO"" KO""$COLOR_RS""\n""$COL_KO""[ERROR]""$COL_RS""Cannot create directory ""$triggerDirectory""/." && exit 1)
fi

case "$trigger__type" in
  'webhook')
    create_file controller
    create_file data
    create_file dto
    create_file webhook
    ;;
  'poll')
    create_file data
    create_file dto
    create_file poll
    ;;
  *)
    echo -e "Invalid trigger-type ($1): Only 'webhook' or 'poll' are accepted.";
    exit 1
    ;;
esac
