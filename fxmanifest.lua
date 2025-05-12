fx_version 'cerulean'
game 'gta5'

description 'Modern DW Garages System'
version '1.0.0'

shared_scripts {
    '@qb-core/shared/locale.lua',
    'config.lua',
}

client_scripts {
    'client.lua',
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server.lua',
}

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/script.js',
    'html/style.css',
}

escrow_ignore {
    'config.lua'
}

dependency 'qb-core'

lua54 'yes'