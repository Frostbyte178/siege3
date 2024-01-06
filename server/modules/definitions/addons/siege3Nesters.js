//Demo for Nester-type boss ideas.

// NAMES (future): "Nest Paralyzer", "placeholder"
// TODO: Helix (Arms race tank, not desmos), 

const { combineStats } = require('../facilitators.js');
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

    // Spawner nester
    Class.nestIndustry = {
        PARENT: ["miniboss"],
        LABEL: "Nest Industry",
        UPGRADE_LABEL: "Nest Industry",
        UPGRADE_COLOR: 'purple',
        COLOR: 'purple',
        SHAPE: 5,
        SIZE: 50,
        BODY: {
            FOV: 2.2,
            SPEED: base.SPEED * 0.2,
            HEALTH: base.HEALTH * 10,
            SHIELD: base.SHIELD * 1.3,
            REGEN: base.REGEN * 0.85,
            DAMAGE: base.DAMAGE * 2.7,
        },
        VALUE: 3e5,
        GUNS: [],
        TURRETS: [
            {
                POSITION: [9, 0, 0, 0, 360, 1],
                TYPE: 'nestIndustryTop'
            },
        ],
    };
    for (let i = 0; i < 5; i++) {
        Class.nestIndustry.GUNS.push(
            {
                POSITION: [12, 9.5, 1, 0, 0, 72 * i + 36, 0],
            }, {
                POSITION: [1.5, 10.5, 1, 12, 0, 72 * i + 36, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.drone, g.weak, g.weak, g.celeslower, g.nest_keeper]),
                    TYPE: "sentinelCrossbow",
                    SYNCS_SKILLS: true,
                    AUTOFIRE: true,
                    STAT_CALCULATOR: gunCalcNames.drone,
                    MAX_CHILDREN: 2,
                },
            }, {
                POSITION: [10.5, 10.5, 1, 0, 0, 72 * i + 36, 0],
            }
        )
        Class.nestIndustry.TURRETS.push(
            {
                POSITION: [8, 9, 0, i * 72, 120, 0],
                TYPE: "builderTurret",
            },
        )
    }
    Class.nestIndustry.GUNS[1].PROPERTIES.TYPE = ["sentinelCrossbow", {CLEAR_ON_MASTER_UPGRADE: true}],
    Class.nestIndustry.GUNS[4].PROPERTIES.TYPE = ["sentinelMinigun", {CLEAR_ON_MASTER_UPGRADE: true}],
    Class.nestIndustry.GUNS[7].PROPERTIES.TYPE = ["sentinelLauncher", {CLEAR_ON_MASTER_UPGRADE: true}],
    Class.nestIndustry.GUNS[10].PROPERTIES.TYPE = ["sentinelMinigun", {CLEAR_ON_MASTER_UPGRADE: true}],
    Class.nestIndustry.GUNS[13].PROPERTIES.TYPE = ["sentinelCrossbow", {CLEAR_ON_MASTER_UPGRADE: true}],

    // Long range nester
    Class.nestSynthesizer = {
        PARENT: ["miniboss"],
        LABEL: "Nest Synthesizer",
        UPGRADE_LABEL: "Nest Synthesizer",
        UPGRADE_COLOR: 14,
        COLOR: 14,
        SHAPE: 5,
        SIZE: 50,
        BODY: {
            FOV: 2.5,
            SPEED: base.SPEED * 0.18,
            HEALTH: base.HEALTH * 9,
            SHIELD: base.SHIELD * 1.5,
            REGEN: base.REGEN * 0.7,
            DAMAGE: base.DAMAGE * 2.5,
        },
        VALUE: 3e5,
        GUNS: [],
        TURRETS: [
            {
                POSITION: [9, 0, 0, 0, 360, 1],
                TYPE: 'xPredatorTurret'
            }
        ],
    };
    for (let i = 0; i < 5; i++) {
        Class.nestSynthesizer.GUNS.push(
            {
                POSITION: [10, 10, -0.5, 4, 0, 72 * (i + 0.5), 0],
            }, {
                POSITION: [12, 11, -1.3, 0, 0, 72 * (i + 0.5), 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.sniper, g.sniper, g.hunter, g.sidewind, {range: 2, size: 0.55}]),
                    TYPE: "snake",
                    STAT_CALCULATOR: gunCalcNames.sustained,
                    AUTOFIRE: true,
                },
            },
        )
        Class.nestSynthesizer.TURRETS.push(
            {
                POSITION: [8, 9, 0, i * 72, 0, 0],
                TYPE: 'flameTurret',
            },
        )
    }

    // Brawler nester
    Class.nestPurifier = {
        PARENT: 'miniboss',
        LABEL: "Nest Purifier",
        UPGRADE_LABEL: "Nest Purifier",
        UPGRADE_COLOR: 14,
        COLOR: 14,
        SHAPE: 5,
        SIZE: 50,
        BODY: {
            FOV: 2.5,
            SPEED: base.SPEED * 0.45,
            HEALTH: base.HEALTH * 11,
            SHIELD: base.SHIELD * 2.5,
            REGEN: base.REGEN * 0.4,
            DAMAGE: base.DAMAGE * 2.5,
        },
        VALUE: 3e5,
        GUNS: [
            {
                POSITION: [0, 10, 1, 10, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {reload: 10, size: 2, speed: 0}]),
                    TYPE: "shockwave",
                    STAT_CALCULATOR: gunCalcNames.sustained,
                    AUTOFIRE: true,
                },
            }
        ],
        TURRETS: [
            {
                POSITION: [9, 0, 0, 0, 360, 1],
                TYPE: 'culverinTurret'
            }
        ],
    }
    for (let i = 0; i < 5; i++) {
        Class.nestPurifier.GUNS.push(
            {
                POSITION: [13, 12, 0.45, 0, 0, 72 * (i + 0.5), 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {reload: 10}, g.fake]),
                    TYPE: "bullet",
                    AUTOFIRE: true,
                },
            },
        )
        Class.nestPurifier.TURRETS.push(
            {
                POSITION: [8, 9, 0, i * 72, 0, 0],
                TYPE: 'topplerTurret',
            },
        )
    }

    //Push Nester to Nesters.
    Class.nesters.UPGRADES_TIER_0.push("nestPurger", "nestGrenadier", "nestBrigadier", "nestIndustry", "nestSynthesizer", 'nestPurifier');
}