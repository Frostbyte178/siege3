//Demo for Nester-type boss ideas.

// NAMES (future): "Nest Paralyzer", "placeholder"
// TODO: Helix (Arms race tank, not desmos), 

const { combineStats, skillSet, makeAuto } = require('../facilitators.js');
const { base, gunCalcNames } = require('../constants.js');
const g = require('../gunvals.js');

module.exports = ({ Class }) => {
    //Base for Nesters, this is for creating them so I don't have to go back into bosses for them.

    Class.nestBase = {
        PARENT: ["miniboss"],
        LABEL: "Nest Base",
        COLOR: "purple",
        UPGRADE_COLOR: "purple",
        SHAPE: 5,
        SIZE: 50,
        BODY: {
            FOV: 1.3,
            SPEED: base.SPEED * 0.25,
            HEALTH: base.HEALTH * 9,
            SHIELD: base.SHIELD * 1.5,
            REGEN: base.REGEN,
            DAMAGE: base.DAMAGE * 2.5,
        },
        GUNS: [],
        TURRETS: [
            {
                POSITION: [9, 0, 0, 0, 360, 1],
                TYPE: [ "autoTankGun", { INDEPENDENT: true, COLOR: -1 } ],
            },
        ],
    };
    for(let i = 0; i < 5; i++) {
        Class.nestBase.GUNS.push({
                POSITION: [1.5, 8, 1.2, 9.5, 0, 72*i+36, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.block, g.construct]),
                    TYPE: "bullet",
                    STAT_CALCULATOR: gunCalcNames.block
                },
            },
        );
        Class.nestBase.TURRETS.push(
            {
                POSITION: [8, 9, 0, 72*i, 120, 0],
                TYPE: [ "autoTankGun", { INDEPENDENT: true, COLOR: -1 } ],
            }
        );
    };

    // Now let's make the actual bullets.

    Class.autoTrap = makeAuto(Class.trap, "autoTrap")

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
    Class.slowHomingMissile = {
        PARENT: "homingMissile",
        GUNS: [{
            POSITION: [16.5, 10, 1.5, 0, 0, 180, 10],
            PROPERTIES: {
                AUTOFIRE: true,
                STAT_CALCULATOR: gunCalcNames.thruster,
                SHOOT_SETTINGS: combineStats([g.basic, g.missileTrail, g.rocketeerMissileTrail, {recoil: 0.85}]),
                TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
            },
        }],
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
Class.nestbuilder = {
    PARENT: ["genericTank"],
    GUNS: [
        {
            POSITION: [18, 12, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [2, 12, 1.1, 18, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.block, g.halfreload, g.halfreload]),
                TYPE: "unsetTrap",
	        AUTOFIRE: true,
            },
        },
    ],
};


Class.nestreactorspinner = {
    PARENT: ["genericTank"],
    COLOR: 14,
    CONTROLLERS: [["spin", { independent: true, speed: -0.05 }]],
       GUNS: [
            {
                /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
                POSITION: [15, 7, 1, 0, 0, 0, 0],
            },
            {
                POSITION: [3, 7, 1.7, 15, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap]),
                    TYPE: "trap",
                    STAT_CALCULATOR: gunCalcNames.trap,
		    AUTOFIRE: true,
		    WAIT_TO_CYCLE: true,
                },
            },
            {
                POSITION: [15, 7, 1, 0, 0, 51.42857143, 4 * 0.1428571429],
            },
            {
                POSITION: [3, 7, 1.7, 15, 0, 51.42857143, 4 * 0.1428571429],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap]),
                    TYPE: "trap",
                    STAT_CALCULATOR: gunCalcNames.trap,
		    AUTOFIRE: true,
		    WAIT_TO_CYCLE: true,
                },
            },
            {
                POSITION: [15, 7, 1, 0, 0, 2 * 51.42857143, 1 * 0.1428571429],
            },
            {
                POSITION: [3, 7, 1.7, 15, 0, 2 * 51.42857143, 1 * 0.1428571429],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap]),
                    TYPE: "trap",
                    STAT_CALCULATOR: gunCalcNames.trap,
		    AUTOFIRE: true,
		    WAIT_TO_CYCLE: true,
                },
            },
            {
                POSITION: [15, 7, 1, 0, 0, 3 * 51.42857143, 5 * 0.1428571429],
            },
            {
                POSITION: [3, 7, 1.7, 15, 0, 3 * 51.42857143, 5 * 0.1428571429],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap]),
                    TYPE: "trap",
                    STAT_CALCULATOR: gunCalcNames.trap,
		    AUTOFIRE: true,
		    WAIT_TO_CYCLE: true,
                },
            },
            {
                POSITION: [15, 7, 1, 0, 0, 4 * 51.42857143, 2 * 0.1428571429],
            },
            {
                POSITION: [3, 7, 1.7, 15, 0, 4 * 51.42857143, 2 * 0.1428571429],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap]),
                    TYPE: "trap",
                    STAT_CALCULATOR: gunCalcNames.trap,
		    AUTOFIRE: true,
		    WAIT_TO_CYCLE: true,
                },
            },
            {
                POSITION: [15, 7, 1, 0, 0, 5 * 51.42857143, 6 * 0.1428571429],
            },
            {
                POSITION: [3, 7, 1.7, 15, 0, 5 * 51.42857143, 6 * 0.1428571429],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap]),
                    TYPE: "trap",
                    STAT_CALCULATOR: gunCalcNames.trap,
		    AUTOFIRE: true,
		    WAIT_TO_CYCLE: true,
                },
            },
            {
                POSITION: [15, 7, 1, 0, 0, 6 * 51.42857143, 3 * 0.1428571429],
            },
            {
                POSITION: [3, 7, 1.7, 15, 0, 6 * 51.42857143, 3 * 0.1428571429],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap]),
                    TYPE: "trap",
                    STAT_CALCULATOR: gunCalcNames.trap,
		    AUTOFIRE: true,
		    WAIT_TO_CYCLE: true,
                },
            },
        ],
};
Class.nestreactortrap = {
    PARENT: ["genericTank"],
    LABEL: "nest trapper",
    GUNS: [
        {
            POSITION: [15, 7, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [3, 7, 1.7, 15, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap]),
                AUTOFIRE: true,
                TYPE: "trap",
                STAT_CALCULATOR: gunCalcNames.trap,
		
            },
        },
    ],
};

    Class.miniMissileShield = {
        PARENT: "missile",
        GUNS: [],
    };

    for(let i = 0; i < 3; i++) {
        Class.miniMissileShield.GUNS.push({
                POSITION: [14, 6, 1, 0, 0, i * 120, 0],
                PROPERTIES: {
                    AUTOFIRE: true,
                    SHOOT_SETTINGS: combineStats([g.basic, g.skim, g.doublereload, g.lowpower, g.muchmorerecoil, g.morespeed]),
                    TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
                    STAT_CALCULATOR: gunCalcNames.thruster,
            }
        })
    }

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

    // Ok now it's Nester time.

    //Undertow Nester.
    Class.nestPurger = {
        PARENT: ["miniboss"],
        LABEL: "Nest Purger",
        COLOR: "purple",
        UPGRADE_COLOR: "purple",
        RECOIL_MULTIPLIER: 0,
        SHAPE: 5,
        SIZE: 50,
        BODY: {
            FOV: 1.3,
            SPEED: base.SPEED * 0.25,
            HEALTH: base.HEALTH * 9,
            SHIELD: base.SHIELD * 1.5,
            REGEN: base.REGEN,
            DAMAGE: base.DAMAGE * 2.5,
        },
        VALUE: 3e5,
        GUNS: [],
        TURRETS: [
            {
                POSITION: [9, 0, 0, 0, 360, 1],
                TYPE: "undertowTurret",
            },
        ],
    };
    for(let i = 0; i < 5; i++) {
        Class.nestPurger.GUNS.push({
                POSITION: [-1.5, 8, 1.2, 11, 0, 72*i+36, 0],
            },{
                POSITION: [1.5, 8, 1.2, 11, 0, 72*i+36, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.block, g.halfspeed, g.slow, g.halfreload, g.halfreload,  { size: 0.5 } ]),
                    TYPE: "autoTrap",
                    STAT_CALCULATOR: gunCalcNames.trap,
                },
            }
        );
        Class.nestPurger.TURRETS.push({
            POSITION: [8, 10, 0, 72*i, 120, 0],
            TYPE: [ "assassin", { INDEPENDENT: true, COLOR: -1 }, {CONTROLLERS: ["onlyAcceptInArc", "nearestDifferentMaster"]}, ],
        });
    };
    
    //Firework Nester.
    Class.nestGrenadier = {
        PARENT: ["miniboss"],
        LABEL: "Nest Grenadier",
        COLOR: "purple",
        UPGRADE_COLOR: "purple",
        SHAPE: 5,
        SIZE: 50,
        BODY: {
            FOV: 1.5,
            SPEED: base.SPEED * 0.25,
            HEALTH: base.HEALTH * 9,
            SHIELD: base.SHIELD * 1.5,
            REGEN: base.REGEN,
            DAMAGE: base.DAMAGE * 2.5,
        },
        VALUE: 3e5,
        GUNS: [],
        TURRETS: [{
                POSITION: [9, 0, 0, 0, 360, 1],
                TYPE: [ "fireworkTurret" ],
        }],
    };
    for(let i = 0; i < 5; i++) {
        Class.nestGrenadier.GUNS.push({
            POSITION: [11, 7.5, -0.4, 0, 0, 72*i+36, 0],
        },{
            POSITION: [1.5, 7.5, 1.3, 11, 0, 72*i+36, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.hexatrap, { shudder: 0.75, size: 0.25 } ]),
                TYPE: "trap"
            },
        });
        Class.nestGrenadier.TURRETS.push({
            POSITION: [8, 9, 0, 72*i, 120, 0],
            TYPE: [ "superNailgunTurret" ],
        });
    };

    // Launcher Nester
    Class.nestBrigadier = {
        PARENT: ["miniboss"],
        LABEL: "Nest Brigadier",
        COLOR: "purple",
        UPGRADE_COLOR: "purple",
        SHAPE: 5,
        SIZE: 50,
        BODY: {
            FOV: 1.5,
            SPEED: base.SPEED * 0.25,
            HEALTH: base.HEALTH * 9,
            SHIELD: base.SHIELD * 1.5,
            REGEN: base.REGEN,
            DAMAGE: base.DAMAGE * 2.5,
        },
        VALUE: 3e5,
        GUNS: [],
        TURRETS: [
            {
                POSITION: [9, 0, 0, 0, 360, 1],
                TYPE: [ "sidewinderTurret" ],
            },
        ],
    };
    for(let i = 0; i < 5; i++) {
        Class.nestBrigadier.GUNS.push({
            POSITION: [2.5, 6.5, 1, 9.5, 0, 72*i+36, 0],
        }, {
            POSITION: [1.5, 9, 1, 9.5, 0, 72*i+36, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.launcher, g.pound, g.destroy, g.halfspeed, g.halfspeed, g.halfspeed, g.veryfast, g.veryfast, { reload: 0.7, damage: 1/6, health: 7, size: 0.85, range: 1.3 } ]),
                TYPE: "bigminimissile",
                STAT_CALCULATOR: gunCalcNames.block
            },
        });
        Class.nestBrigadier.TURRETS.push({
            POSITION: [8, 9, 0, 72*i, 25, 0],
            TYPE: [ "homingMissileTurret" ],
        });
    };

// Warning, Nest bulk is unbalanced as shit and needs to be reworked heavily
Class.nestIndustry = {
    PARENT: ["miniboss"],
    LABEL: "Nest Industry",
  UPGRADE_LABEL: "Nest Industry",
  UPGRADE_COLOR: 14,
    COLOR: 14,
    SHAPE: 5,
    MAX_CHILDREN: 5,
    SIZE: 55,
    BODY: {
        FOV: 2.2,
        SPEED: base.SPEED * 0.1,
        HEALTH: base.HEALTH * 10,
        SHIELD: base.SHIELD * 1.1,
        REGEN: base.REGEN,
        DAMAGE: base.DAMAGE * 2.4,
    },
    GUNS: [
        {
            POSITION: [11, 12, 1, 0, 0, 35, 0],
        },
        {
            /*** LENGTH    WIDTH     ASPECT        X             Y         ANGLE     DELAY */
            POSITION: [2, 14, 1, 11, 0, 35, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.weak, g.weak, g.celeslower, g.nest_keeper]),
                TYPE: ["sentinelCrossbow"],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: gunCalcNames.drone,
            },
        },
        {
            POSITION: [11, 12, 1, 0, 0, -35, 0],
        },
        {
            /*** LENGTH    WIDTH     ASPECT        X             Y         ANGLE     DELAY */
            POSITION: [2, 14, 1, 11, 0, -35, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.weak, g.weak, g.celeslower, g.nest_keeper]),
                TYPE: ["sentinelMinigun"],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: gunCalcNames.drone,
            },
        },
        {
            POSITION: [11, 12, 1, 0, 0, 180, 0],
        },
        {
            /*** LENGTH    WIDTH     ASPECT        X             Y         ANGLE     DELAY */
            POSITION: [2, 14, 1, 11, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.weak, g.weak, g.celeslower, g.nest_keeper]),
                TYPE: ["sentinelLauncher"],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: gunCalcNames.drone,
            },
        },
        {
            POSITION: [11, 12, 1, 0, 0, 108, 0],
        },
        {
            /*** LENGTH    WIDTH     ASPECT        X             Y         ANGLE     DELAY */
            POSITION: [2, 14, 1, 11, 0, 108, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.weak, g.weak, g.celeslower, g.nest_keeper]),
                TYPE: ["sentinelLauncher"],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: gunCalcNames.drone,
            },
	},
        {
            POSITION: [11, 12, 1, 0, 0, -108, 0],
        },
        {
            /*** LENGTH    WIDTH     ASPECT        X             Y         ANGLE     DELAY */
            POSITION: [2, 14, 1, 11, 0, -108, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.weak, g.weak, g.celeslower, g.nest_keeper]),
                TYPE: ["sentinelCrossbow"],
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: gunCalcNames.drone,
            },
        },
    ],
    TURRETS: [
        {
            POSITION: [8, 9, 0, 72, 120, 0],
            TYPE: [
                "nestbuilder",
                {
                    INDEPENDENT: true,
                    COLOR: 14,
	            AUTOFIRE: true,
                },
            ],
        },
        {
            POSITION: [8, 9, 0, 0, 120, 0],
            TYPE: [
                "nestbuilder",
                {
                    INDEPENDENT: true,
                    COLOR: 14,
	            AUTOFIRE: true,
                },
            ],
        },
        {
            POSITION: [8, 9, 0, 144, 120, 0],
            TYPE: [
                "nestbuilder",
                {
                    INDEPENDENT: true,
                    COLOR: 14,
	            AUTOFIRE: true,
                },
            ],
        },
        {
            POSITION: [8, 9, 0, 216, 120, 0],
            TYPE: [
                "nestbuilder",
                {
                    INDEPENDENT: true,
                    COLOR: 14,
	            AUTOFIRE: true,
                },
            ],
        },
        {
            POSITION: [8, 9, 0, -72, 120, 0],
            TYPE: [
                "nestbuilder",
                {
                    INDEPENDENT: true,
                    COLOR: 14,
	            AUTOFIRE: true,
                },
            ],
        },
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: [
                "nestreactorspinner",
                {
                    INDEPENDENT: true,
                    COLOR: 14,
                },
            ],
        },
    ],
};

// Siece note, PLEASE REDO "NEST REACTOR" TO LOOK LIKE IT HAS PROPER SIDEWINDER BARRELS, THIS WAS TAKEN FROM AN OLDER ERA

Class.nestSynthesizer = {
    PARENT: ["miniboss"],
    LABEL: "Nest Synthesizer",
  UPGRADE_LABEL: "Nest Synthesizer",
  UPGRADE_COLOR: 14,
    COLOR: 14,
    SHAPE: 5,
    SIZE: 50,
    BODY: {
        FOV: 1.3,
        SPEED: base.SPEED * 0.25,
        HEALTH: base.HEALTH * 9,
        SHIELD: base.SHIELD * 1.5,
        REGEN: base.REGEN,
        DAMAGE: base.DAMAGE * 2.5,
    },
    GUNS: [
        {
            POSITION: [3.5, 6.65, 1.2, 8, 0, 35, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.nest_keeper]),
                TYPE: "snake",
                AUTOFIRE: true,
                LABEL: "Mega Crasher",
            },
        },
        {
            POSITION: [3.5, 6.65, 1.2, 8, 0, -35, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.nest_keeper]),
                TYPE: "snake",
                AUTOFIRE: true,
                LABEL: "Mega Crasher",
            },
        },
        {
            POSITION: [3.5, 6.65, 1.2, 8, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.nest_keeper]),
                TYPE: "snake",
                AUTOFIRE: true,
                LABEL: "Mega Crasher",
            },
        },
        {
            POSITION: [3.5, 6.65, 1.2, 8, 0, 108, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.nest_keeper]),
                TYPE: "snake",
                AUTOFIRE: true,
                LABEL: "Mega Crasher",
            },
        },
        {
            POSITION: [3.5, 6.65, 1.2, 8, 0, -108, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.nest_keeper]),
                TYPE: "snake",
                AUTOFIRE: true,
                LABEL: "Mega Crasher",
            },
        },
    ],
    TURRETS: [
        {
            POSITION: [8, 9, 0, 72, 120, 0],
            TYPE: [
                "nestreactortrap",
                {
                    INDEPENDENT: true,
                    COLOR: 14,
                },
            ],
        },
        {
            POSITION: [8, 9, 0, 0, 120, 0],
            TYPE: [
                "nestreactortrap",
                {
                    INDEPENDENT: true,
                    COLOR: 14,
                },
            ],
        },
        {
            POSITION: [8, 9, 0, 144, 120, 0],
            TYPE: [
                "nestreactortrap",
                {
                    INDEPENDENT: true,
                    COLOR: 14,
                },
            ],
        },
        {
            POSITION: [8, 9, 0, 216, 120, 0],
            TYPE: [
                "nestreactortrap",
                {
                    INDEPENDENT: true,
                    COLOR: 14,
                },
            ],
        },        {
            POSITION: [8, 9, 0, -72, 120, 0],
            TYPE: [
                "nestreactortrap",
                {
                    INDEPENDENT: true,
                    COLOR: 14,
                },
            ],
        },
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE:[ "predator",
		{
		COLOR: 14,
		},
	],
        },
    ],
};


    //Push Nester to Nesters.
    Class.nesters.UPGRADES_TIER_0.push("nestPurger", "nestGrenadier", "nestBrigadier", "nestIndustry", "nestSynthesizer");
}