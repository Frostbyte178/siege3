const { combineStats, makeAuto } = require('../facilitators.js');
const { base, gunCalcNames } = require('../constants.js');
const g = require('../gunvals.js');

module.exports = ({ Class }) => {
    // Projectiles
    Class.trueBomb = {
        PARENT: "bullet",
        GUNS: [
            {
                POSITION: [0, 10, 0, 0, 0, 0, 9999],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {speed: 0, range: 0.05, damage: 1.3, health: 1e6, size: 16}]),
                    TYPE: ["bullet", { MOTION_TYPE: "withMaster", COLOR: 2, PERSISTS_AFTER_DEATH: true, ALPHA: 0.6 }],
                    SHOOT_ON_DEATH: true,
                    STAT_CALCULATOR: gunCalcNames.sustained,
                }
            }
        ],
        TURRETS: [
            {
                POSITION: [12.5, 0, 0, 0, 0, 1],
                TYPE: ["egg", {COLOR: 16}]
            },
        ]
    }
    Class.autoTrap = makeAuto(Class.trap, "autoTrap", 'droneAutoTurret');
    Class.chargerTrap = {
        PARENT: ["unsetTrap"],
        LABEL: "Charger",
        GUNS: [],
        TURRETS: [{
            POSITION: [10, 0, 0, 0, 360, 1],
            TYPE: ["pentagon", { COLOR: 16 }],
        }],
    };
    for(let i = 0; i < 8; i++) {
        Class.chargerTrap.GUNS.push({
            POSITION: [0, (i % 4) + 1, 0, 0, 0, 0, 9999],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun, { spray: 1e6, recoil: 0, range: 0.5 }]),
                TYPE: ["trap", { PERSISTS_AFTER_DEATH: true }],
                SHOOT_ON_DEATH: true,
            }
        })
    }
    Class.bigminimissile = {
        PARENT: "missile",
        GUNS: [
            {
                POSITION: [14, 6, 1, 0, 0, 180, 1.5],
                PROPERTIES: {
                    AUTOFIRE: true,
                    SHOOT_SETTINGS: combineStats([g.basic, g.skim, g.lowpower, g.muchmorerecoil, g.morespeed]),
                    TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
                    STAT_CALCULATOR: gunCalcNames.thruster,
                },
            },
        ],
    }
    Class.homingMissile = {
        PARENT: "missile",
        LABEL: "Homing Missile",
        BODY: { FOV: 10, SPEED: 0.04 },
        CONTROLLERS: ["nearestDifferentMaster"],
        FACING_TYPE: "smoothToTarget",
        AI: {chase: false, SKYNET: true, },
        GUNS: [{
            POSITION: [16.5, 10, 1.5, 0, 0, 180, 10],
            PROPERTIES: {
                AUTOFIRE: true,
                STAT_CALCULATOR: gunCalcNames.thruster,
                SHOOT_SETTINGS: combineStats([g.basic, g.missileTrail, g.rocketeerMissileTrail, {recoil: 1.7}]),
                TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
            },
        }],
        TURRETS: [{
            POSITION: [9, 0, 0, 0, 0, 1],
            TYPE: ["triangle", {COLOR: 16}]
        }]
    }
    Class.fireworkRocket = {
        PARENT: ["missile"],
        LABEL: "Firework Rocket",
        INDEPENDENT: true,
        GUNS: [{
            POSITION: [16.5, 10, 1.5, 0, 0, 180, 7.5],
            PROPERTIES: {
                AUTOFIRE: true,
                STAT_CALCULATOR: gunCalcNames.thruster,
                SHOOT_SETTINGS: combineStats([g.basic, g.missileTrail, g.rocketeerMissileTrail, {recoil: 1.25}]),
                TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
            },
        }],
        TURRETS: [{
            POSITION: [10, 0, 0, 0, 0, 1],
            TYPE: [ "egg", { COLOR: 16 }, ],
        }],
    };
    for(let i = 0; i < 16; i++) {
        Class.fireworkRocket.GUNS.push({
            POSITION: [0, (i % 4) + 1, 0, 0, 0, 0, 9999],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun, { spray: 1e6, recoil: 0, range: 0.5 }]),
                TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
                SHOOT_ON_DEATH: true,
            }
        })
    }

    // Turrets
    Class.fireworkTurret = {
        PARENT: ["genericTank"],
        LABEL: "Skimmer",
        BODY: { FOV: 2 * base.FOV },
        COLOR: -1,
        INDEPENDENT: true,
        CONTROLLERS: [ "onlyAcceptInArc", "nearestDifferentMaster" ],
        GUNS: [
            {
                POSITION: [12, 10, 1.4, 8, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.launcher, g.rocketeer, g.lessreload, {speed: 4, maxSpeed: 3}]),
                    TYPE: "fireworkRocket",
                    STAT_CALCULATOR: gunCalcNames.sustained,
                },
            }, {
                POSITION: [10, 9.5, 1.4, 8, 0, 0, 0],
            },
        ],
    };
    Class.builderTurret = {
        PARENT: ["genericTank"],
        INDEPENDENT: true,
        COLOR: 'purple',
        GUNS: [
            {
                POSITION: [18, 12, 1, 0, 0, 0, 0],
            }, {
                POSITION: [2, 12, 1.1, 18, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.pound, g.block, g.halfreload, g.halfreload, g.veryfast]),
                    TYPE: "unsetTrap",
                    AUTOFIRE: true,
                },
            },
        ],
    };
    Class.superNailgunTurret = {
        PARENT: ["genericTank"],
        LABEL: "Nailgun",
        BODY: { FOV: 2 * base.FOV },
        COLOR: -1,
        INDEPENDENT: true,
        CONTROLLERS: [ "onlyAcceptInArc", "nearestDifferentMaster" ],
        GUNS: [
            {
                /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                POSITION: [19, 2, 1, 0, -2.5, 0, 0.25],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.power, g.power, g.twin, g.nail, {health: 0.4}]),
                    TYPE: "bullet",
                },
            }, {
                POSITION: [19, 2, 1, 0, 2.5, 0, 0.75],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.power, g.power, g.twin, g.nail, {health: 0.4}]),
                    TYPE: "bullet",
                },
            }, {
                POSITION: [20, 2, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.power, g.power, g.twin, g.nail, {health: 0.4}]),
                    TYPE: "bullet",
                },
            }, {
                POSITION: [5.5, 7, -1.8, 6.5, 0, 0, 0],
            },
        ],
    }
    Class.sidewinderTurret = {
        PARENT: ["genericTank"],
        LABEL: "Nailgun",
        BODY: { FOV: 2 * base.FOV },
        COLOR: -1,
        INDEPENDENT: true,
        CONTROLLERS: [ "onlyAcceptInArc", "nearestDifferentMaster" ],
        GUNS: [
            {
                POSITION: [10, 11, -0.5, 14, 0, 0, 0],
            }, {
                POSITION: [21, 12, -1.3, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.pound, g.assass, g.assass, g.hunter, g.sidewind, {health: 1.5, reload: 0.65}]),
                    TYPE: "snake",
                    STAT_CALCULATOR: gunCalcNames.sustained,
                },
            },
        ],
    }
    Class.homingMissileTurret = {
        PARENT: ["genericTank"],
        BODY: { FOV: 2 * base.FOV },
        COLOR: -1,
        INDEPENDENT: true,
        CONTROLLERS: [ "onlyAcceptInArc", "nearestDifferentMaster" ],
        GUNS: [
            {
                POSITION: [10, 12.5, -0.7, 10, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.launcher, g.rocketeer, {speed: 8, maxSpeed: 2, damage: 0.3, size: 0.7, range: 1.25, reload: 2.5}]),
                    TYPE: "homingMissile",
                    STAT_CALCULATOR: gunCalcNames.sustained,
                    AUTOFIRE: true,
                },
            }, {
                POSITION: [17, 18, 0.65, 0, 0, 0, 0],
            }, {
                POSITION: [13.5, 13, -0.55, 0, 0, 0, 0],
            },
        ],
    }
    Class.undertowTurret = {
        PARENT: ["genericTank"],
        BODY: { FOV: 2 * base.FOV },
        COLOR: -1,
        INDEPENDENT: true,
        CONTROLLERS: [ "onlyAcceptInArc", "nearestDifferentMaster" ],
        GUNS: [
            {
                POSITION: [14, 15, 0.8, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.destroy, {damage: 1/2, speed: 2, maxSpeed: 2}]),
                    TYPE: "bullet",
                },
            }, {
                POSITION: [5, 13, 0, 4, -7.5, 82.5, 0],
            }, {
                POSITION: [5, 13, 0, 4, 7.5, -82.5, 0],
            },
        ],
    }
    Class.nestIndustryTop = {
        PARENT: ["genericTank"],
        COLOR: 14,
        INDEPENDENT: true,
        CONTROLLERS: [["spin", { independent: true, speed: -0.05 }]],
        GUNS: [],
    };
    for (let i = 0; i < 10; i++) {
        Class.nestIndustryTop.GUNS.push({
            POSITION: [7, 7.5, 0.6, 7, 0, 36 * i, i % 2 / 2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.flank]),
                TYPE: ["swarm", {INDEPENDENT: true}],
                STAT_CALCULATOR: gunCalcNames.swarm,
                AUTOFIRE: true,
            },
        })
    }
};