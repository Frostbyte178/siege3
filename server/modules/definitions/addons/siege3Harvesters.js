const { combineStats } = require('../facilitators.js');
const { base, gunCalcNames } = require('../constants.js');
const g = require('../gunvals.js');

const harvesterStats = {
    FOV: 1.4,
    SPEED: 0.7 * base.SPEED,
    HEALTH: 4.5 * base.HEALTH,
    DAMAGE: 1.75 * base.DAMAGE,
    SHIELD: 1.5 * base.SHIELD,
    // Elite stats for reference:
    // FOV: 1.25,
    // SPEED: 0.1 * base.SPEED,
    // HEALTH: 7 * base.HEALTH,
    // DAMAGE: 2.5 * base.DAMAGE,
};

module.exports = ({ Class }) => {
    Class.genericHarvester = {
        PARENT: "miniboss",
        FACING_TYPE: "toTarget",
        BODY: harvesterStats,
        SHAPE: 5.5,
        COLOR: 4,
        SIZE: 22,
        VALUE: 25e4,
    }

    // Rushdown
    Class.furrower = {
        PARENT: "genericHarvester",
        LABEL: "Furrower",
        BODY: {
            HEALTH: harvesterStats.HEALTH * 0.7,
            SPEED: harvesterStats.SPEED * 1.75,
        },
        GUNS: [
            {
                POSITION: [6, 4, 1, 9, 5, 15, 0],
            }, {
                POSITION: [11, 6.5, 1.4, 2, 5, 15, 0.1],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.launcher, {range: 0.5, speed: 2, maxSpeed: 0.25, size: 1.2, reload: 2.2/1.5, damage: 0.6, recoil: 0.15}]),
                    TYPE: "trueBomb",
                    STAT_CALCULATOR: gunCalcNames.sustained,
                },
            }, {
                POSITION: [6, 4, 1, 9, -5, -15, 0],
            }, {
                POSITION: [11, 6.5, 1.4, 2, -5, -15, 0.1],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.launcher, {range: 0.5, speed: 2, maxSpeed: 0.25, size: 1.2, reload: 2.2/1.5, damage: 0.6, recoil: 0.15}]),
                    TYPE: "trueBomb",
                    STAT_CALCULATOR: gunCalcNames.sustained,
                },
            }, {
                POSITION: [18, 9.5, 1, 0, 0, 0, 0.1],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.destroy, {speed: 1.6, maxSpeed: 1.3, health: 0.7, recoil: 0.15}]),
                    TYPE: "bullet",
                },
            }, {
                POSITION: [14.5, 9, -0.5, 0, 0, 144, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.flank, g.tri, g.thruster, {recoil: 1.2, size: 0.75}]),
                    TYPE: "bullet",
                },
            }, {
                POSITION: [14.5, 9, -0.5, 0, 0, -144, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.flank, g.tri, g.thruster, {recoil: 1.2, size: 0.75}]),
                    TYPE: "bullet",
                },
            },
        ],
        TURRETS: [
            {
                POSITION: [13, 0, 0, 180, 360, 1],
                TYPE: ["pentagon", {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
            }
        ]
    }

    // Circler with bombs
    Class.purifierTurret = {
        PARENT: "genericTank",
        CONTROLLERS: ["nearestDifferentMaster"],
        INDEPENDENT: true,
        BODY: {FOV: 10},
        AI: {IGNORE_SHAPES: true},
        GUNS: [
            {
                POSITION: [12, 9, 1, 9, 0, 0, 0],
            }, {
                POSITION: [13, 12.5, 1.4, 5, 0, 0, 0.1],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.launcher, {range: 0.8, speed: 2.5, maxSpeed: 0.35, size: 1.4, reload: 1.8, damage: 0.6, recoil: 0.15}]),
                    TYPE: "trueBomb",
                    STAT_CALCULATOR: gunCalcNames.sustained,
                },
            }, 
        ]
    }
    Class.purifier = {
        PARENT: "genericHarvester",
        LABEL: "Purifier",
        BODY: {
            HEALTH: harvesterStats.HEALTH * 0.8,
            SPEED: harvesterStats.SPEED * 1.5,
            SHIELD: harvesterStats.SHIELD * 1.3,
        },
        GUNS: [
            {
                POSITION: [12, 14, 0.001, 6, 0, 0, 0],
            }, {
                POSITION: [13, 9, -0.4, 0, 0, 72, 0]
            }, {
                POSITION: [2, 9, 1.3, 13, 0, 72, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap, g.slow, {size: 0.85, damage: 0.8, reload: 0.5}]),
                    TYPE: "trap",
                    STAT_CALCULATOR: gunCalcNames.trap,
                    AUTOFIRE: true,
                }
            }, {
                POSITION: [13, 9, -0.4, 0, 0, -72, 0]
            }, {
                POSITION: [2, 9, 1.3, 13, 0, -72, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.hexatrap, g.slow, {size: 0.85, damage: 0.8, reload: 0.5}]),
                    TYPE: "trap",
                    STAT_CALCULATOR: gunCalcNames.trap,
                    AUTOFIRE: true,
                }
            }, {
                POSITION: [14.5, 9, -0.5, 0, 0, 144, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.flank, g.tri, g.thruster, {recoil: 1.2, size: 0.75}]),
                    TYPE: "bullet",
                },
            }, {
                POSITION: [14.5, 9, -0.5, 0, 0, -144, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.flank, g.tri, g.thruster, {recoil: 1.2, size: 0.75}]),
                    TYPE: "bullet",
                },
            },
        ],
        TURRETS: [
            {
                POSITION: [15, 0, 0, 180, 360, 1],
                TYPE: ["pentagon", {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
            }, {
                POSITION: [12, 0, 0, 0, 360, 1],
                TYPE: "purifierTurret"
            }
        ]
    }

    Class.harvesters = {
        PARENT: ["menu"],
        LABEL: "Harvesters",
        COLOR: 4,
        UPGRADE_COLOR: 4,
        SHAPE: 5.5,
        UPGRADES_TIER_0: ["furrower", "purifier"],
    }

    Class.bosses.UPGRADES_TIER_0.push("harvesters")
}