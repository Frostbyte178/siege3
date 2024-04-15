const { combineStats, skillSet } = require('../facilitators.js');
const { base, gunCalcNames } = require('../constants.js');
const g = require('../gunvals.js');

const harvesterStats = {
    FOV: 2,
    SPEED: 0.45 * base.SPEED,
    HEALTH: 5 * base.HEALTH,
    DAMAGE: 1.75 * base.DAMAGE,
    SHIELD: 2 * base.SHIELD,
    // Elite stats for reference:
    // FOV: 1.25,
    // SPEED: 0.1 * base.SPEED,
    // HEALTH: 7 * base.HEALTH,
    // DAMAGE: 2.5 * base.DAMAGE,
};

function addThruster(recoilFactor = 4) {
    return [
        {
            POSITION: [12.5, 14, -0.5, 3, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.flank, g.tri, g.thruster, {reload: 0.5, recoil: recoilFactor, size: 0.45}]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [9, 8.5, 0.001, 6, 1.5, -152, 0],
        }, {
            POSITION: [9, 8.5, 0.001, 6, -1.5, 152, 0],
        }
    ]
}

module.exports = ({ Class }) => {
    Class.genericHarvester = {
        PARENT: "minibossBase",
        FACING_TYPE: "toTarget",
        BODY: harvesterStats,
        SHAPE: 6,
        COLOR: 0,
        SIZE: 22,
        VALUE: 3e5,
        FORCE_TWIGGLE: true,
        AI: {IGNORE_SHAPES: true},
        SKILL: skillSet({
            rld: 0.7,
            dam: 0.5,
            pen: 0.8,
            str: 0.8,
            spd: 0.2,
            atk: 0.3,
            hlt: 1,
            shi: 0.7,
            rgn: 0.7,
            mob: 1,
        }),
    }

    // Rushdown
    Class.furrower = {
        PARENT: "genericHarvester",
        LABEL: "Furrower",
        CONTROLLERS: ["nearestDifferentMaster", "bombingRun"],
        BODY: {
            HEALTH: harvesterStats.HEALTH * 0.75,
            SPEED: harvesterStats.SPEED * 1.75,
        },
        AI: {IGNORE_SHAPES: true, BLIND: true, chase: true},
        GUNS: [
            { // Bomb launchers
                POSITION: [5, 5, 1, 8.5, 7, 12, 0],
            }, {
                POSITION: [10, 6.5, 1.4, 1.5, 7, 12, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.launcher, {range: 0.4, speed: 2, maxSpeed: 0.4, size: 1.2, reload: 2.2, damage: 0.55, recoil: 0.15}]),
                    TYPE: "trueBomb",
                    STAT_CALCULATOR: gunCalcNames.sustained,
                    ALT_FIRE: true,
                },
            }, {
                POSITION: [5, 5, 1, 8.5, -7, -12, 0],
            }, {
                POSITION: [10, 6.5, 1.4, 1.5, -7, -12, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.launcher, {range: 0.4, speed: 2, maxSpeed: 0.4, size: 1.2, reload: 2.2, damage: 0.55, recoil: 0.15}]),
                    TYPE: "trueBomb",
                    STAT_CALCULATOR: gunCalcNames.sustained,
                    ALT_FIRE: true,
                },
            }, { // Destroyer
                POSITION: [18, 9.5, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.destroy, {speed: 1.6, maxSpeed: 1.3, health: 0.7, reload: 1.5, recoil: 0.15}]),
                    TYPE: "bullet",
                    ALT_FIRE: true,
                },
            },
            ...addThruster(4),
        ],
        TURRETS: [
            {
                POSITION: [13, 0, 0, 180, 360, 1],
                TYPE: ["hexagon", {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
            }
        ]
    }

    // Circler with bombs
    Class.pressurizerTurret = {
        PARENT: "genericTank",
        CONTROLLERS: ["nearestDifferentMaster"],
        INDEPENDENT: true,
        BODY: {FOV: 15},
        AI: {IGNORE_SHAPES: true, SKYNET: true, chase: true},
        GUNS: [
            {
                POSITION: [12, 9, 1, 9, 0, 0, 0],
            }, {
                POSITION: [13, 12.5, 1.4, 5, 0, 0, 0.1],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.launcher, {range: 0.65, speed: 2.5, maxSpeed: 0.55, size: 1.4, reload: 1.8, damage: 0.8, recoil: 0.15}]),
                    TYPE: "trueBomb",
                    STAT_CALCULATOR: gunCalcNames.sustained,
                },
            }, 
        ]
    }
    Class.pressurizer = {
        PARENT: "genericHarvester",
        LABEL: "Pressurizer",
        CONTROLLERS: ["nearestDifferentMaster", "circleTarget"],
        BODY: {
            HEALTH: harvesterStats.HEALTH * 0.8,
            SPEED: harvesterStats.SPEED * 1.5,
            SHIELD: harvesterStats.SHIELD * 1.3,
        },
        AI: {IGNORE_SHAPES: true, SKYNET: true, chase: true},
        GUNS: [
            {
                POSITION: [13, 12, 0.001, 6, 0, 0, 0],
            }, { // Machine traps
                POSITION: [13, 9, -0.4, 0, 0, 60, 0]
            }, {
                POSITION: [2, 9, 1.3, 13, 0, 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap, g.slow, {size: 0.85, damage: 0.8, reload: 0.5}]),
                    TYPE: "trap",
                    STAT_CALCULATOR: gunCalcNames.trap,
                    AUTOFIRE: true,
                }
            }, {
                POSITION: [13, 9, -0.4, 0, 0, -60, 0]
            }, {
                POSITION: [2, 9, 1.3, 13, 0, -60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap, g.slow, {size: 0.85, damage: 0.8, reload: 0.5}]),
                    TYPE: "trap",
                    STAT_CALCULATOR: gunCalcNames.trap,
                    AUTOFIRE: true,
                }
            },
            ...addThruster(3.5),
        ],
        TURRETS: [
            {
                POSITION: [15, 0, 0, 180, 360, 1],
                TYPE: ["hexagon", {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
            }, {
                POSITION: [12, 0, 0, 0, 360, 1],
                TYPE: "pressurizerTurret"
            }
        ]
    }

    // Wall maker
    Class.stockyard = {
        PARENT: "genericHarvester",
        LABEL: "Stockyard",
        CONTROLLERS: ["nearestDifferentMaster", ["bombingRun", {breakAwayAngle: 10, alwaysFireInRange: true}]],
        BODY: {
            HEALTH: harvesterStats.HEALTH * 0.75,
            SPEED: harvesterStats.SPEED * 1.6,
            SHIELD: harvesterStats.SHIELD * 1.3,
        },
        AI: {IGNORE_SHAPES: true, SKYNET: true, chase: true},
        GUNS: [
            { // Shockwave
                POSITION: [13, 7, 0.001, 3, 5, 0, 0],
            }, {
                POSITION: [13, 7, 0.001, 3, -5, 0, 0],
            }, {
                POSITION: [13, 10, -0.4, 3, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.mach, g.mach, {speed: 0.25, health: 2, density: 3, spray: 0.5, size: 0.5, shudder: 0.1}]),
                    TYPE: "bullet",
                }
            }, { // Thrusters
                POSITION: [12.5, 7.5, -0.5, 1, -5, 165, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.flank, g.tri, g.thruster, {reload: 0.5, recoil: 1.8, size: 0.8}]),
                    TYPE: "bullet",
                },
            }, {
                POSITION: [12.5, 7.5, -0.5, 1, 5, -165, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.flank, g.tri, g.thruster, {reload: 0.5, recoil: 1.8, size: 0.8}]),
                    TYPE: "bullet",
                },
            }, {
                POSITION: [7, 6.5, 0.001, 6, 2.5, -130, 0],
            }, {
                POSITION: [7, 6.5, 0.001, 6, -2.5, 130, 0],
            }, { // Block layer
                POSITION: [13.5, 10, -0.4, 0, 0, 180, 0]
            }, {
                POSITION: [1.5, 10, 1.3, 13.5, 0, 180, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.block, g.mach, g.mach, {health: 1.85, reload: 0.55, spray: 0.3}]),
                    TYPE: "unsetTrap",
                    STAT_CALCULATOR: gunCalcNames.block,
                    ALT_FIRE: true,
                }
            },
        ],
        TURRETS: [
            {
                POSITION: [13, 0, 0, 180, 360, 1],
                TYPE: ["hexagon", {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
            }
        ]
    }

    // MIRV
    Class.irrigator = {
        PARENT: "genericHarvester",
        LABEL: "Irrigator",
        CONTROLLERS: ["nearestDifferentMaster", ["drag", {range: 1500}]],
        BODY: {
            HEALTH: harvesterStats.HEALTH * 1.5,
            SPEED: harvesterStats.SPEED,
            SHIELD: harvesterStats.SHIELD * 1.7,
            FOV: harvesterStats.FOV * 2,
        },
        AI: {IGNORE_SHAPES: true, SKYNET: true},
        GUNS: [
            { // BR Missile
                POSITION: [9, 5.5, -0.7, 7, 5, 28, 0.18],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.launcher, g.rocketeer, {speed: 8, damage: 0.3, size: 0.7, range: 1.1, reload: 2.5}]),
                    TYPE: ["homingMissile", {CONTROLLERS: [["missileGuidance", {slowTurnDelay: 800, fastTurnDelay: 1700}]]}],
                    STAT_CALCULATOR: gunCalcNames.sustained,
                    ALT_FIRE: true,
                },
            }, {
                POSITION: [17, 8.5, 0.65, -3, 5, 28, 0],
            }, {
                POSITION: [13.5, 6, -0.55, -3, 5, 28, 0],
            }, { // BL Missile
                POSITION: [9, 5.5, -0.7, 7, -5, -28, 0.18],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.launcher, g.rocketeer, {speed: 8, damage: 0.3, size: 0.7, range: 1.1, reload: 2.5}]),
                    TYPE: ["homingMissile", {CONTROLLERS: [["missileGuidance", {slowTurnDelay: 800, fastTurnDelay: 1700}]]}],
                    STAT_CALCULATOR: gunCalcNames.sustained,
                    ALT_FIRE: true,
                },
            }, {
                POSITION: [17, 8.5, 0.65, -3, -5, -28, 0],
            }, {
                POSITION: [13.5, 6, -0.55, -3, -5, -28, 0],
            }, { // FR Missile
                POSITION: [9, 5.5, -0.7, 8.5, 2, 9, 0.06],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.launcher, g.rocketeer, {speed: 8, damage: 0.3, size: 0.7, range: 1.1, reload: 2.5}]),
                    TYPE: ["homingMissile", {CONTROLLERS: [["missileGuidance", {slowTurnDelay: 800, fastTurnDelay: 1400}]]}],
                    STAT_CALCULATOR: gunCalcNames.sustained,
                    ALT_FIRE: true,
                },
            }, {
                POSITION: [17, 8.5, 0.65, -1.5, 2, 9, 0],
            }, {
                POSITION: [13.5, 6, -0.55, -1.5, 2, 9, 0],
            }, { // FL Missile
                POSITION: [9, 5.5, -0.7, 8.5, -2, -9, 0.06],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.launcher, g.rocketeer, {speed: 8, damage: 0.3, size: 0.7, range: 1.1, reload: 2.5}]),
                    TYPE: ["homingMissile", {CONTROLLERS: [["missileGuidance", {slowTurnDelay: 800, fastTurnDelay: 1400}]]}],
                    STAT_CALCULATOR: gunCalcNames.sustained,
                    ALT_FIRE: true,
                },
            }, {
                POSITION: [17, 8.5, 0.65, -1.5, -2, -9, 0],
            }, {
                POSITION: [13.5, 6, -0.55, -1.5, -2, -9, 0],
            }, 
            ...addThruster(3.5)
        ],
        TURRETS: [
            {
                POSITION: [13, 0, 0, 180, 360, 1],
                TYPE: ["hexagon", {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
            }
        ]
    }
    g.quarterstaff = { reload: 2, health: 1.3, speed: 1.3, spray: 1.5 }
    Class.quarterstaff = {
        PARENT: "genericHarvester",
        LABEL: "Quarterstaff",
        CONTROLLERS: ["nearestDifferentMaster", ["bombingRun", {goAgainRange: 1600, firingRange: 550, breakAwayRange: 400, alwaysFireInRange: true}]],
        BODY: {
            HEALTH: harvesterStats.HEALTH * 0.7e90,
            SPEED: harvesterStats.SPEED * 1.8,
            FOV: harvesterStats.FOV * 1.2,
        },
        SKILL: skillSet({
            rld: 0.7,
            dam: 0.5,
            pen: 0.8,
            str: 0.8,
            spd: 0.8, // Default 0.2
            atk: 0.3,
            hlt: 0.7, // Default 1
            shi: 0.7,
            rgn: 0.7,
            mob: 1,
        }),
        AI: {IGNORE_SHAPES: true, BLIND: true, SKYNET: true, chase: true},
        GUNS: [
            { // Shotgun of 14 bullets
                POSITION: [4, 3, 1, 11, -3, 0, 0.05],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun, g.quarterstaff]),
                    TYPE: "bullet",
                    ALT_FIRE: true,
                },
            }, {
                POSITION: [4, 3, 1, 11, 3, 0, 0.05],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun, g.quarterstaff]),
                    TYPE: "bullet",
                    ALT_FIRE: true,
                },
            }, {
                POSITION: [4, 4, 1, 13, 0, 0, 0.05],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun, g.quarterstaff]),
                    TYPE: "casing",
                    ALT_FIRE: true,
                },
            }, {
                POSITION: [1, 4, 1, 12, -1, 0, 0.05],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun, g.quarterstaff]),
                    TYPE: "casing",
                    ALT_FIRE: true,
                },
            }, {
                POSITION: [1, 4, 1, 11, 1, 0, 0.05],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun, g.quarterstaff]),
                    TYPE: "casing",
                    ALT_FIRE: true,
                },
            }, {
                POSITION: [1, 3, 1, 13, -1, 0, 0.05],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun, g.quarterstaff]),
                    TYPE: "bullet",
                    ALT_FIRE: true,
                },
            }, {
                POSITION: [1, 3, 1, 13, 1, 0, 0.05],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun, g.quarterstaff]),
                    TYPE: "bullet",
                    ALT_FIRE: true,
                },
            }, {
                POSITION: [1, 2, 1, 13, 2, 0, 0.05],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun, g.quarterstaff]),
                    TYPE: "casing",
                    ALT_FIRE: true,
                },
            }, {
                POSITION: [1, 2, 1, 13, -2, 0, 0.05],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun, g.quarterstaff]),
                    TYPE: "casing",
                    ALT_FIRE: true,
                },
            }, { // New guns
                POSITION: [1, 4, 1, 11, 3, 0, 0.05],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun, g.quarterstaff]),
                    TYPE: "bullet",
                    ALT_FIRE: true,
                },
            }, {
                POSITION: [1, 3, 1, 12, -2, 0, 0.05],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun, g.quarterstaff]),
                    TYPE: "bullet",
                    ALT_FIRE: true,
                },
            }, {
                POSITION: [1, 2, 1, 11, 0, 0, 0.05],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun, g.quarterstaff]),
                    TYPE: "bullet",
                    ALT_FIRE: true,
                },
            }, {
                POSITION: [1, 2, 1, 13, 2, 0, 0.05],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun, g.quarterstaff]),
                    TYPE: "casing",
                    ALT_FIRE: true,
                },
            }, {
                POSITION: [1, 3, 1, 12, 1, 0, 0.05],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun, g.quarterstaff]),
                    TYPE: "casing",
                    ALT_FIRE: true,
                },
            }, {
                POSITION: [15, 11, 1, 6, 0, 0, 0.05],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun, g.quarterstaff, g.fake]),
                    TYPE: "casing",
                    ALT_FIRE: true,
                },
            }, {
                POSITION: [8, 11, -1.3, 4, 0, 0, 0],
            }, { // Thrusters
                POSITION: [12.5, 7.5, -0.5, 1, -5, 160, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.flank, g.tri, g.thruster, {reload: 0.5, recoil: 2.4, size: 0.8}]),
                    TYPE: "bullet",
                },
            }, {
                POSITION: [12.5, 7.5, -0.5, 1, 5, -160, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.flank, g.tri, g.thruster, {reload: 0.5, recoil: 2.4, size: 0.8}]),
                    TYPE: "bullet",
                },
            }, {
                POSITION: [7, 6.5, 0.001, 6, 2.5, -125, 0],
            }, {
                POSITION: [7, 6.5, 0.001, 6, -2.5, 125, 0],
            }, { // Bomb launcher
                POSITION: [10, 7, 1, 9, 0, 180, 0],
            }, {
                POSITION: [11, 10.5, 1.4, 5, 0, 180, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.launcher, {range: 0.25, speed: 1.9, maxSpeed: 0.4, size: 1.4, reload: 3, recoil: 0.6}]),
                    TYPE: "trueBomb",
                    STAT_CALCULATOR: gunCalcNames.sustained,
                    ALT_FIRE: true,
                },
            }, 
        ],
        TURRETS: [
            {
                POSITION: [13, 0, 0, 180, 360, 1],
                TYPE: ["hexagon", {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
            }
        ]
    }

    Class.harvesters = {
        PARENT: ["menu"],
        LABEL: "Harvesters",
        COLOR: 0,
        UPGRADE_COLOR: 0,
        SHAPE: 6,
        TURRETS: [{
            POSITION: [15, 0, 0, 180, 360, 1],
            TYPE: ["hexagon", {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
        }],
        UPGRADES_TIER_0: ["furrower", "pressurizer", "stockyard", "irrigator", "quarterstaff"],
    }

    Class.bosses.UPGRADES_TIER_0.push("harvesters");
}