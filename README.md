# 🚗 DW-Garages

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![QBCore](https://img.shields.io/badge/framework-QBCore-red.svg)
![License](https://img.shields.io/badge/license-Commercial-green.svg)

**DW-Garages** is a premium, feature-rich vehicle garage management system for QBCore FiveM servers. Take your server's vehicle management to the next level with advanced features, seamless UI, and comprehensive options.

## ✨ Features

- **Beautiful UI Interface** - Clean, intuitive interface for easy vehicle management
- **Multiple Garage Types**:
  - Public garages for personal vehicles
  - Job-specific garages with custom vehicle lists
  - Gang garages with shared vehicles
  - Impound system with fees and retrieval
- **Shared Garages** - Create and manage garages shared between players
- **Vehicle Transfer System** - Transfer vehicles between different garages with animated delivery service
- **Advanced Vehicle Storage** - Fade in/out animations and visual indicators for vehicle storage
- **Favorites System** - Mark your most-used vehicles for quick access
- **Custom Vehicle Names** - Rename your vehicles for easy identification
- **Search Functionality** - Quickly find specific vehicles in large collections
- **Category Filtering** - Filter by vehicle type, favorites, or ownership
- **Impound System** - Full impound functionality for law enforcement with reason logging and fees
- **Full Customization** - Easily configure all aspects through the config.json file

## 📋 Requirements

- QBCore Framework
- oxmysql
- LegacyFuel (or compatible fuel script)

## 🔧 Installation

### Step 1: Download & Extract
1. Download the resource
2. Extract to your resources folder
3. Rename the folder to `dw-garages`

⚙️ Configuration
Basic Configuration Options


```lua
 Config = {
    UseTarget = false,                 -- Use qb-target instead of DrawText3D
    VehicleSpawnDistance = 5.0,        -- Distance to spawn vehicles from the garage point
    TransferCost = 500,                -- Cost to transfer vehicles between garages
    EnableTransferAnimation = true,    -- Enable/disable the transfer truck animation
    EnableImpound = true,              -- Enable the impound system
    ImpoundFee = 500                   -- Base fee for impound retrieval
}
```
Adding New Garages
To add a new garage, add a new entry to the Config.Garages table in config.lua:

```lua
Config.Garages = {
    yourgarage = {
        label = 'Your New Garage',
        coords = vector4(215.9, -810.65, 30.73, 339.54),
        type = 'public',
        spawnPoints = {
            vector4(222.89, -804.16, 30.15, 248.0),
            vector4(224.51, -798.82, 30.15, 248.0)
        },
        transferSpawn = vector4(195.4, -825.3, 30.2, 340.0),
        transferArrival = vector4(213.2, -799.8, 30.1, 250.0),
        transferExit = vector4(178.5, -833.6, 30.8, 160.0)
    }
}
```

Adding Job Vehicles`
To add vehicles to job garages, edit the Config.JobGarages table:

```lua
Config.JobGarages = {
    police = {
        label = 'Police Garage',
        coords = vector4(454.6, -1017.4, 28.4, 90.0),
        type = 'job',
        job = 'police',
        spawnPoint = vector4(438.4, -1018.3, 27.7, 90.0),
        vehicles = {
            newvehicle = {
                label = 'New Police Vehicle',
                model = 'policeb',
                icon = '🏍️'
            }
        }
    }
}
```

Blip Settings
Garage blip settings can be configured inside:

```lua
Config.GarageBlip = {
    Enable = true,
    Sprite = 357,
    Color = 3,
    Scale = 0.7,
    Display = 4,
    ShortRange = true
}
```

### Step 2: Database Setup
Run the included SQL file in your database:

```sql
-- Import through your database management tool or run:
mysql -u username -p yourdb < dw-garages.sql
```

### Step 3: Server Configuration
Add the following to your server.cfg:

```
ensure dw-garages
```

### Step 4: Verify Installation
1. Start your server
2. Check the server console for any error messages
3. In-game, visit any garage location to verify the script is working


Basic Configuration Options
lua
Copy
Edit
Config = {
    UseTarget = false,                 -- Use qb-target instead of DrawText3D
    VehicleSpawnDistance = 5.0,        -- Distance to spawn vehicles from the garage point
    TransferCost = 500,                -- Cost to transfer vehicles between garages
    EnableTransferAnimation = true,    -- Enable/disable the transfer truck animation
    EnableImpound = true,              -- Enable the impound system
    ImpoundFee = 500                   -- Base fee for impound retrieval
}
Adding New Garages
To add a new garage, add a new entry to the Config.Garages table in config.lua:

bash
Copy
Edit
Config.Garages = {
    yourgarage = {
        label = 'Your New Garage',
        coords = vector4(215.9, -810.65, 30.73, 339.54),
        type = 'public',
        spawnPoints = {
            vector4(222.89, -804.16, 30.15, 248.0),
            vector4(224.51, -798.82, 30.15, 248.0)
        },
        transferSpawn = vector4(195.4, -825.3, 30.2, 340.0),
        transferArrival = vector4(213.2, -799.8, 30.1, 250.0),
        transferExit = vector4(178.5, -833.6, 30.8, 160.0)
    }
}
Adding Job Vehicles
To add vehicles to job garages, edit the Config.JobGarages table:

bash
Copy
Edit
Config.JobGarages = {
    police = {
        label = 'Police Garage',
        coords = vector4(454.6, -1017.4, 28.4, 90.0),
        type = 'job',
        job = 'police',
        spawnPoint = vector4(438.4, -1018.3, 27.7, 90.0),
        vehicles = {
            newvehicle = {
                label = 'New Police Vehicle',
                model = 'policeb',
                icon = '🏍️'
            }
        }
    }
}
Blip Settings
Garage blip settings can be configured inside:

pgsql
Copy
Edit
Config.GarageBlip = {
    Enable = true,
    Sprite = 357,
    Color = 3,
    Scale = 0.7,
    Display = 4,
    ShortRange = true
}


## 🔍 JSON Editing Tips

When editing the config.json file:

1. Always use **double quotes** for keys and string values
2. Do not leave trailing commas after the last item in arrays or objects
3. Validate your JSON using a tool like [JSONLint](https://jsonlint.com/)
4. Coordinates must follow the format: `{"x": 0.0, "y": 0.0, "z": 0.0, "w": 0.0}`
5. Save the file in UTF-8 encoding

## 🎮 In-Game Usage

### Public Garages
- Visit any garage location to access your personal vehicles
- Use the interface to retrieve or store vehicles
- Mark favorites for quick access
- Rename vehicles for easy identification
- Transfer vehicles between garages

### Job Garages
- Access job-specific vehicles from your job's garage
- Job vehicles are automatically available based on your job

### Gang Garages
- Share vehicles with your gang members
- Store and retrieve gang vehicles

### Shared Garages
- Create a shared garage from the garage interface
- Share the access code with friends to give them access
- Manage members through the interface

### Impound
- Law enforcement can use `/impound [fee]` to impound vehicles
- Players must pay the fee to recover their impounded vehicles

## ❓ Troubleshooting

### "Config not loaded" error
- Verify that config.json exists and is correctly formatted
- Check for JSON syntax errors using a validator

### Vehicles not appearing
- Ensure your database is properly set up with the SQL file
- Check if the player owns the vehicles
- Verify garage coordinates are correct

### Permissions issues
- Check job/gang configurations match your server's job/gang names
- Verify that players have the correct permissions

## 📞 Support

For support with this resource:
- Discord: discord.gg/7Ds8V64fk8

## 📝 License

This resource is **FREE** for the community. You may use and modify it as you wish, but please respect the following:

- Do not redistribute as paid content
- Maintain credits to original author
- Share improvements with the community

---

Thank you for purchasing DW-Garages! We hope you enjoy the resource.
