#!/bin/bash

# function to get current timestamp
generate_filename() {
    echo "schefsbackup_$(date +%Y%m%d_%H%M%S).gz"
}

if [[ ! -z "$SCHEFSBACKUP" ]]; then
    backup_dir=$SCHEFSBACKUP
else
    backup_dir=.
fi

backup_file="$backup_dir/$(generate_filename)"
echo $backup_file
pg_dump $PGDATABASE | gzip > "$backup_file"
gupload $backup_file -q

if [ $? -eq 0 ]; then
    echo "$(date +%Y-%m-%d %T) - Schefs PSQL backup successful"
fi
