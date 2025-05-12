Config = {}

-- General garage settings
Config.UseTarget = false -- Use qb-target interactions instead of DrawText3D
Config.VehicleSpawnDistance = 5.0 -- Distance to spawn vehicles from garage point
Config.SpawnTimeout = 30000 -- Time (in ms) before vehicle spawning times out
Config.VehicleFadeTime = 2000 -- Time in milliseconds for vehicle fade animation
Config.TransferCost = 500 -- Cost to transfer a vehicle between garages
Config.EnableTransferAnimation = true  -- Set to false to disable the truck animation
Config.EnableImpound = true -- false to remove impound
Config.ImpoundFee = 500  -- Base fee to retrieve a vehicle from impound
Config.AdditionalDayFee = 250  -- Additional fee per day in impound
Config.MaxFeeMultiplier = 5  -- Maximum multiplier for fees
Config.ShowJobVehiclesTab = true -- Show Job Vehicles tab in garage
Config.LostVehicleTimeout = 7200 -- Time in seconds before an out vehicle is considered lost (2 hours)
Config.LostVehicleTimeout = 3600 -- 1 hour
Config.ImpoundJobs = {
    ['police'] = true,
    ['sheriff'] = true,
    ['highway'] = true
}
Config.ImpounderTypes = {
    ["police"] = "Police",
    ["government"] = "Government",
    ["judge"] = "Court",
    ["admin"] = "Administrator"
}

Config.JobParkingSpots = {
    ['police'] = {
        vector4(446.05395, -1025.607, 28.646846, 10.391553),
        vector4(442.25765, -1025.844, 28.717491, 37.374588),
        vector4(438.53656, -1026.5, 28.78754, 42.148361),
        vector4(434.99621, -1026.865, 28.851186, 26.760805),
        vector4(431.12667, -1027.418, 28.921892, 50.015827),
        vector4(427.40734, -1027.538, 28.987623, 0.8152692)
    }
}


-- Blip settings
Config.GarageBlip = {
    Enable = true,
    Sprite = 357,
    Color = 3,
    Scale = 0.7,
    Display = 4,
    ShortRange = true
}

-- Shared garage settings
Config.EnableSharedGarages = true -- Enable/disable shared garages feature
Config.MaxSharedVehicles = 15 -- Maximum vehicles per shared garage
Config.MaxSharedGarageMembers = 10 -- Maximum members per shared garage
Config.SharedGarageBlip = {
    Enable = true,
    Sprite = 357,
    Color = 5, -- Different color for shared garages (purple)
    Scale = 0.7,
    Display = 4,
    ShortRange = true
}

-- Jobs that have access to job vehicles
Config.JobVehicleAccess = {
    ['police'] = true,
    ['ambulance'] = true,
    ['mechanic'] = true,
}

-- Public garages
Config.Garages = {
    ['legion'] = {
        label = 'Legion Square Garage',
        coords = vector4(215.9, -810.65, 30.73, 339.54),
        type = 'public',
        spawnPoints = {
            vector4(222.89, -804.16, 30.15, 248.0),
            vector4(224.51, -798.82, 30.15, 248.0),
            vector4(220.71, -808.72, 30.15, 248.0),
            vector4(218.22, -812.71, 30.15, 248.0),
        },
        -- Transfer animation points
        transferSpawn = vector4(195.4, -825.3, 30.2, 340.0),
        transferArrival = vector4(213.2, -799.8, 30.1, 250.0),
        transferExit = vector4(178.5, -833.6, 30.8, 160.0),
    },
    ['pinkcage'] = {
        label = 'Pink Cage Garage',
        coords = vector4(273.0, -343.85, 44.92, 161.0),
        type = 'public',
        spawnPoints = {
            vector4(270.94, -339.8, 44.92, 160.0),
            vector4(276.54, -342.56, 44.92, 160.0),
            vector4(265.86, -337.32, 44.92, 160.0),
        },
        -- Transfer animation points
        transferSpawn = vector4(251.6, -372.8, 44.6, 70.0),
        transferArrival = vector4(274.3, -333.5, 44.9, 160.0),
        transferExit = vector4(238.2, -386.5, 44.3, 250.0),
    },
    ['pillbox'] = {
        label = 'Pillbox Garage',
        coords = vector4(215.68, -1384.14, 30.58, 320.0),
        type = 'public',
        spawnPoint = vector4(219.01, -1382.13, 30.58, 91.34),
        -- Transfer animation points
        transferSpawn = vector4(238.5, -1394.5, 30.5, 50.0),
        transferArrival = vector4(217.3, -1377.2, 30.6, 140.0),
        transferExit = vector4(248.8, -1407.2, 30.4, 320.0),
    },
    ['moviestar'] = {
        label = 'Movie Star Garage',
        coords = vector4(-1039.78, -855.05, 4.86, 120.01),
        type = 'public',
        spawnPoint = vector4(-1042.94, -856.54, 4.51, 31.37),
        -- Transfer animation points
        transferSpawn = vector4(-1057.3, -876.8, 5.0, 30.0),
        transferArrival = vector4(-1045.2, -850.1, 4.5, 300.0),
        transferExit = vector4(-1073.8, -882.5, 4.5, 210.0),
    },
    ['paleto'] = {
        label = 'Paleto Garage',
        coords = vector4(80.99, 6361.25, 31.34, 134.0),
        type = 'public',
        spawnPoint = vector4(84.91, 6365.16, 31.24, 45.0),
        -- Transfer animation points
        transferSpawn = vector4(105.7, 6342.2, 31.3, 315.0),
        transferArrival = vector4(77.2, 6355.1, 31.3, 135.0),
        transferExit = vector4(120.5, 6329.8, 31.3, 225.0),
    },
    ['sandy'] = {
        label = 'Sandy Shores Garage',
        coords = vector4(1728.67, 3710.93, 34.22, 20.0),
        type = 'public',
        spawnPoint = vector4(1724.84, 3715.38, 34.19, 19.68),
        -- Transfer animation points
        transferSpawn = vector4(1746.8, 3685.9, 34.6, 210.0),
        transferArrival = vector4(1732.6, 3707.4, 34.2, 20.0),
        transferExit = vector4(1752.3, 3668.7, 34.5, 120.0),
    }
}

-- Job garages
Config.JobGarages = {
    ['police'] = {
        label = 'Police Garage',
        coords = vector4(454.6, -1017.4, 28.4, 90.0),
        type = 'job',
        job = 'police',
        spawnPoint = vector4(438.4, -1018.3, 27.7, 90.0),
        -- Transfer animation points
        transferSpawn = vector4(431.5, -1035.4, 28.8, 0.0),
        transferArrival = vector4(452.3, -1023.6, 28.4, 90.0),
        transferExit = vector4(425.1, -1043.8, 29.2, 180.0),
        vehicles = {
            ['police'] = {
                label = 'Police Cruiser',
                model = 'police',
                icon = '🚓'
            },
            ['police2'] = {
                label = 'Police SUV',
                model = 'police2',
                icon = '🚓'
            },
            ['police3'] = {
                label = 'Police Interceptor',
                model = 'police3',
                icon = '🚓'
            }
        }
    },
    ['ambulance'] = {
        label = 'EMS Garage',
        coords = vector4(327.14, -558.78, 28.74, 339.54),
        type = 'job',
        job = 'ambulance',
        spawnPoint = vector4(320.84, -548.9, 28.74, 180.0),
        -- Transfer animation points
        transferSpawn = vector4(307.8, -542.2, 28.7, 270.0),
        transferArrival = vector4(325.6, -551.3, 28.7, 340.0),
        transferExit = vector4(298.2, -537.4, 28.6, 180.0),
        vehicles = {
            ['ambulance'] = {
                label = 'Ambulance',
                model = 'ambulance',
                icon = '🚑'
            }
        }
    },
    ['mechanic'] = {
        label = 'Mechanic Garage',
        coords = vector4(-344.94, -124.4, 39.01, 339.54),
        type = 'job',
        job = 'mechanic',
        spawnPoint = vector4(-350.85, -136.39, 39.01, 70.29),
        -- Transfer animation points
        transferSpawn = vector4(-362.3, -140.8, 38.7, 120.0),
        transferArrival = vector4(-347.5, -129.2, 39.0, 340.0),
        transferExit = vector4(-372.6, -148.3, 38.2, 210.0),
        vehicles = {
            ['towtruck'] = {
                label = 'Tow Truck',
                model = 'towtruck',
                icon = '🛻'
            },
            ['flatbed'] = {
                label = 'Flatbed',
                model = 'flatbed',
                icon = '🚚'
            }
        }
    }
}

-- Gang garages
Config.GangGarages = {
    ['ballas'] = {
        label = 'Ballas Garage',
        coords = vector4(83.72, -1932.17, 20.79, 318.73),
        type = 'gang',
        gang = 'ballas',
        spawnPoint = vector4(90.33, -1926.79, 20.69, 47.28),
        -- Transfer animation points
        transferSpawn = vector4(104.5, -1946.8, 20.8, 140.0),
        transferArrival = vector4(84.9, -1925.3, 20.8, 320.0),
        transferExit = vector4(113.2, -1958.6, 20.7, 230.0),
    },
    ['vagos'] = {
        label = 'Vagos Garage',
        coords = vector4(334.75, -2039.65, 21.1, 50.36),
        type = 'gang',
        gang = 'vagos',
        spawnPoint = vector4(329.84, -2035.4, 20.99, 139.32),
        -- Transfer animation points
        transferSpawn = vector4(315.3, -2023.6, 20.4, 230.0),
        transferArrival = vector4(332.4, -2037.1, 21.0, 50.0),
        transferExit = vector4(305.8, -2013.2, 20.0, 140.0),
    },
    ['families'] = {
        label = 'Families Garage',
        coords = vector4(-810.94, 187.57, 72.48, 119.22),
        type = 'gang',
        gang = 'families',
        spawnPoint = vector4(-805.44, 183.98, 72.6, 206.48),
        -- Transfer animation points
        transferSpawn = vector4(-789.7, 173.3, 71.8, 300.0),
        transferArrival = vector4(-807.2, 185.3, 72.5, 120.0),
        transferExit = vector4(-778.3, 167.6, 71.2, 200.0),
    }
}

-- Impound lots
Config.ImpoundLots = {
    ['mission_row'] = {
        label = 'Mission Row Impound',
        coords = vector4(409.36, -1622.71, 29.29, 140.24),
        blip = {
            sprite = 477, 
            color = 64,  
            scale = 0.7,
            display = 4,
            shortRange = true
        },
        spawnPoints = {
            vector4(404.95, -1643.82, 29.29, 320.0),
            vector4(408.91, -1646.94, 29.29, 320.0),
            vector4(412.79, -1650.19, 29.29, 320.0)
        }
    },
    ['paleto'] = {
        label = 'Paleto Bay Impound',
        coords = vector4(-193.33, 6271.79, 31.49, 318.48),
        blip = {
            sprite = 477,
            color = 64,
            scale = 0.7,
            display = 4,
            shortRange = true
        },
        spawnPoints = {
            vector4(-187.56, 6266.92, 31.49, 134.48),
            vector4(-190.56, 6263.92, 31.49, 134.48)
        }
    },
    ['sandy'] = {
        label = 'Sandy Shores Impound',
        coords = vector4(1728.61, 3709.35, 34.19, 19.67),
        blip = {
            sprite = 477,
            color = 64,
            scale = 0.7,
            display = 4,
            shortRange = true
        },
        spawnPoints = {
            vector4(1722.34, 3713.63, 34.21, 19.67)
        }
    }
}