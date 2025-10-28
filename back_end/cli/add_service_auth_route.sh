#!/usr/bin/env bash

COL_OK="\e[32m"
COL_KO="\e[31m"
COL_RS="\e[0m"

if [ -z $1 ]; then
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

  if [ $dir == "/" ]; then
    echo -e $COL_KO"[Error]"$COL_RS" Project root folder not found.";
    exit 1;
  fi
}
find_root_path

function create_file() {
  file_extension=$1
  echo -ne $COL_OK"[+]$COL_RS Generating file $service__name.$file_extension.ts ..."
  cp "$placeholderDirectory/service-name.$file_extension.ts.placeholder" "$serviceDirectory/$service__name.$file_extension.ts" \
    || (echo -e $COL_KO" KO"$COL_RS"\n"$COL_KO"[ERROR]"$COL_RS"File not found: $serviceDirectory/service-name.$file_extension.ts" && exit 1)

  sed -i $serviceDirectory/$service__name.$file_extension.ts    \
     -e "s/<ServiceName>/$ServiceName/g"                        \
     -e "s/<serviceName>/$serviceName/g"                        \
     -e "s/<service-name>/$service__name/g"                     \
     -e "s/<service_name>/$service_name/g"
  echo -e $COL_KO" OK"$COL_RS
}

service_name=$(echo $service__name | sed 's/-/_/g')
serviceName=$(echo $service__name | sed 's/.*/\L&/' | sed -E ':a; s/-([a-z])/\U\1/g; ta')
ServiceName=$(echo $service__name | sed 's/.*/\L&/' | sed -E ':a; s/-([a-z])/\U\1/g; ta' | sed 's/^./\U&/')

placeholderDirectory="$root_dir/back_end/cli/assets/oauth2-service"
serviceDirectory="$root_dir/back_end/src/app/oauth2/services/$service__name"

if [ -d $serviceDirectory ]; then
  echo -e $COL_KO"[ERROR]"$COL_RS" This service already exists.";
  exit 1;
fi

echo -ne $COL_OK"[+]"$COL_RS" Creating directory $serviceDirectory/..."
mkdir -p $serviceDirectory || (echo -ne $COL_KO" KO"$COLOR_RS"\n"$COL_KO"[ERROR]"$COL_RS"Cannot create directory $serviceDirectory/." && exit 1)
echo -e $COL_OK" OK"$COL_RS

create_file controller
create_file guard
create_file module
create_file strategy
