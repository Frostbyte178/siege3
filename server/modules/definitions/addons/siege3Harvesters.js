const { combineStats } = require('../facilitators.js');
const { base, gunCalcNames } = require('../constants.js');
const g = require('../gunvals.js');

const harvesterStats = {
    FOV: 2,
    SPEED: 0.45 * base.SPEED,
    HEALTH: 4 * base.HEALTH,
    DAMAGE: 1.75 * base.DAMAGE,
    SHIELD: 1.5 * base.SHIELD,
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
        VALUE: 25e4,
        FORCE_TWIGGLE: true,
        AI: {IGNORE_SHAPES: true},
    }

    // Rushdown
    Class.furrower = {
        PARENT: "genericHarvester",
        LABEL: "Furrower",
        CONTROLLERS: ["nearestDifferentMaster", "bombingRun"],
        BODY: {
            HEALTH: harvesterStats.HEALTH * 0.7,
            SPEED: harvesterStats.SPEED * 1.75,
        },
        AI: {IGNORE_SHAPES: true, chase: true},
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
        AI: {IGNORE_SHAPES: true, BLIND: true},
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
        UPGRADES_TIER_0: ["furrower", "pressurizer"],
    }

    Class.bosses.UPGRADES_TIER_0.push("harvesters")
}