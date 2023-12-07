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
                /*** LENGTH    WIDTH     ASPECT        X             Y         ANGLE     DELAY */
                POSITION: [14, 6, 1, 0, 0, 180, 0],
                PROPERTIES: {
                    AUTOFIRE: true,
                    SHOOT_SETTINGS: combineStats([
                        g.basic,
                        g.skim,
                        g.lowpower,
                        g.muchmorerecoil,
                        g.morespeed,
                    ]),
                    TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
                    STAT_CALCULATOR: gunCalcNames.thruster,
                },
            },
        ],
    }

    Class.fireworkRocket = {
        PARENT: ["missile"],
        LABEL: "Firework Rocket",
        INDEPENDENT: true,
        GUNS: [{
            POSITION: [6, 12, 1.4, 8, 0, 180, 0],
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
                    SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assass, g.assass, g.hunter, g.preda, g.sidewind]),
                    TYPE: "snake",
                    STAT_CALCULATOR: gunCalcNames.sustained,
                },
            },
        ],
    }
    Class.flameTurret = {
        PARENT: ["genericTank"],
        LABEL: "Flamethrower",
        BODY: { FOV: 2 * base.FOV },
        COLOR: -1,
        INDEPENDENT: true,
        CONTROLLERS: [ "onlyAcceptInArc", "nearestDifferentMaster" ],
        GUNS: [
            {
				POSITION: [14, 2.5, -1.7, 0, 6.5, 0, 0],
			}, {
				POSITION: [14, 2.5, -1.7, 0, -6.5, 0, 0],
			}, {
				POSITION: [22, 7, 1.3, 0, 0, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, {reload: 0.25, recoil: 0.1, shudder: 1.5, range: 0.5, spray: 7, health: 1/3, speed: 1.2, maxSpeed: 0.3}]),
					TYPE: 'growBullet',
				}
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
        GUNS: [],
        TURRETS: [
            {
                // NOTE, THIS IS MEANT TO BE FOR UNDERTOW, UNDERTOW IS NOT ADDED YET.
                POSITION: [9, 0, 0, 0, 360, 1],
                TYPE: [ "volute", { INDEPENDENT: true, COLOR: -1 }, {CONTROLLERS: ["onlyAcceptInArc", "nearestDifferentMaster"]}, ],
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
            FOV: 1.3,
            SPEED: base.SPEED * 0.25,
            HEALTH: base.HEALTH * 9,
            SHIELD: base.SHIELD * 1.5,
            REGEN: base.REGEN,
            DAMAGE: base.DAMAGE * 2.5,
        },
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

    // Desmos Nester

    Class.nestBrigadier = {
        PARENT: ["miniboss"],
        LABEL: "Nest Brigadier",
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
                SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.launcher, g.pound, g.destroy, g.halfspeed, g.halfspeed, g.halfspeed, g.doublereload, { size: 0.75 } ]),
                TYPE: "bigminimissile",
                STAT_CALCULATOR: gunCalcNames.block
            },
        });
        Class.nestBrigadier.TURRETS.push({
            POSITION: [8, 9, 0, 72*i, 120, 0],
            TYPE: [ "flameTurret" ],
        });
    };

    //Push Nester to Nesters.
    Class.nesters.UPGRADES_TIER_0.push("nestPurger", "nestGrenadier", "nestBrigadier");
}