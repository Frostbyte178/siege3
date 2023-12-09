const { combineStats } = require('../facilitators.js');
const { base, gunCalcNames } = require('../constants.js');
const g = require('../gunvals.js');

const harvesterStats = {
    FOV: 1.4,
    SPEED: 0.7 * base.SPEED,
    HEALTH: 5 * base.HEALTH,
    DAMAGE: 1.75 * base.DAMAGE,
    // Elite stats for reference:
    // FOV: 1.25,
    // SPEED: 0.1 * base.SPEED,
    // HEALTH: 7 * base.HEALTH,
    // DAMAGE: 2.5 * base.DAMAGE,
};

module.exports = ({ Class }) => {
    // Misc
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
                    SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.launcher, {range: 0.5, speed: 2, maxSpeed: 0.25, size: 1.2, reload: 2.2/1.5, recoil: 0.15}]),
                    TYPE: "trueBomb",
                    STAT_CALCULATOR: gunCalcNames.sustained,
                },
            }, {
                POSITION: [6, 4, 1, 9, -5, -15, 0],
            }, {
                POSITION: [11, 6.5, 1.4, 2, -5, -15, 0.1],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.launcher, {range: 0.5, speed: 2, maxSpeed: 0.25, size: 1.2, reload: 2.2/1.5, recoil: 0.15}]),
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

    Class.harvesters = {
        PARENT: ["menu"],
        LABEL: "Harvesters",
        COLOR: 4,
        UPGRADE_COLOR: 4,
        SHAPE: 5.5,
        UPGRADES_TIER_0: ["furrower"],
    }

    Class.bosses.UPGRADES_TIER_0.push("harvesters")
}