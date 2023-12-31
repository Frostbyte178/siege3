const { combineStats } = require('../facilitators.js');
const { base, gunCalcNames } = require('../constants.js');
const g = require('../gunvals.js');

const harvesterStats = {
    FOV: 2,
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
        PARENT: "minibossBase",
        FACING_TYPE: "toTarget",
        BODY: harvesterStats,
        SHAPE: 6,
        COLOR: 0,
        SIZE: 22,
        VALUE: 25e4,
        FORCE_TWIGGLE: true,
        AI: {IGNORE_SHAPES: true},
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
            { // Bomb launchers
                POSITION: [5, 5, 1, 9, 6, 20, 0],
            }, {
                POSITION: [10, 6.5, 1.4, 2, 6, 20, 0.1],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.launcher, {range: 0.5, speed: 2, maxSpeed: 0.25, size: 1.2, reload: 2.2/1.5, damage: 0.6, recoil: 0.15}]),
                    TYPE: "trueBomb",
                    STAT_CALCULATOR: gunCalcNames.sustained,
                },
            }, {
                POSITION: [5, 5, 1, 9, -6, -20, 0],
            }, {
                POSITION: [10, 6.5, 1.4, 2, -6, -20, 0.1],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.launcher, {range: 0.5, speed: 2, maxSpeed: 0.25, size: 1.2, reload: 2.2/1.5, damage: 0.6, recoil: 0.15}]),
                    TYPE: "trueBomb",
                    STAT_CALCULATOR: gunCalcNames.sustained,
                },
            }, { // Destroyer
                POSITION: [18, 9.5, 1, 0, 0, 0, 0.1],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.destroy, {speed: 1.6, maxSpeed: 1.3, health: 0.7, recoil: 0.15}]),
                    TYPE: "bullet",
                },
            }, { // Thruster
                POSITION: [8.5, 17, 0.7, 4, 0, 180, 0],
            }, {
                POSITION: [14.5, 14, -0.5, 3, 0, 180, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.flank, g.tri, g.thruster, {reload: 0.5, recoil: 2.2, size: 0.45}]),
                    TYPE: "bullet",
                },
            }
        ],
        TURRETS: [
            {
                POSITION: [13, 0, 0, 180, 360, 1],
                TYPE: ["hexagon", {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
            }
        ]
    }

    // Circler with bombs
    Class.purifierTurret = {
        PARENT: "genericTank",
        CONTROLLERS: ["nearestDifferentMaster"],
        INDEPENDENT: true,
        BODY: {FOV: 15},
        AI: {IGNORE_SHAPES: true, BLIND: true},
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
        CONTROLLERS: ["nearestDifferentMaster", "circleTarget"],
        BODY: {
            HEALTH: harvesterStats.HEALTH * 0.8e80,
            SPEED: harvesterStats.SPEED * 1.5,
            SHIELD: harvesterStats.SHIELD * 1.3,
        },
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
            }, { // Thruster
                POSITION: [8.5, 17, 0.7, 4, 0, 180, 0],
            }, {
                POSITION: [14.5, 14, -0.5, 3, 0, 180, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.flank, g.tri, g.thruster, {reload: 0.5, recoil: 2.2, size: 0.45}]),
                    TYPE: "bullet",
                },
            }
        ],
        TURRETS: [
            {
                POSITION: [15, 0, 0, 180, 360, 1],
                TYPE: ["hexagon", {COLOR: -1, MIRROR_MASTER_ANGLE: true}]
            }, {
                POSITION: [12, 0, 0, 0, 360, 1],
                TYPE: "purifierTurret"
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
        UPGRADES_TIER_0: ["furrower", "purifier"],
    }

    Class.bosses.UPGRADES_TIER_0.push("harvesters")
}