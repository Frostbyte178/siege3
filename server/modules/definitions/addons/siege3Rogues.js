const { base, gunCalcNames } = require("../constants");
const g = require('../gunvals.js');
const { combineStats } = require("../facilitators");

module.exports = ({ Class }) => {
    // Hex rogues
    Class.rogueBarricadeTurret = {
        PARENT: "genericTank",
        LABEL: "Turret",
        INDEPENDENT: true,
        COLOR: "grey",
        GUNS: [
            {
                POSITION: [16, 19, -0.7, 0, 0, 0, 0],
            }, {
                POSITION: [4, 19, 1.3, 16, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.mach, g.power, g.slow, g.hexatrap, {shudder: 0.5}]),
                    TYPE: "trap",
                    STAT_CALCULATOR: gunCalcNames.trap,
                    AUTOFIRE: true,
                },
            },
        ],
    }
    Class.rogueBarricade = {
        PARENT: "miniboss",
        LABEL: "Rogue Barricade",
        COLOR: "darkGrey",
        UPGRADE_COLOR: "darkGrey",
        SHAPE: 6,
        SIZE: 30,
        VALUE: 5e5,
        CONTROLLERS: ['nearestDifferentMaster', 'onlyAcceptInArc'],
        BODY: {
            FOV: 1.4,
            SPEED: 0.05 * base.SPEED,
            HEALTH: 16 * base.HEALTH,
            SHIELD: 3 * base.SHIELD,
            DAMAGE: 3 * base.DAMAGE,
        },
        GUNS: Array(6).fill().map((_, i) => (
            {
                POSITION: [5, 6, 1.3, 8, 0, 60*i, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.drone, g.destroy, g.lessreload, {size: 1.5}]),
                    TYPE: ["drone", {INDEPENDENT: true}],
                    STAT_CALCULATOR: gunCalcNames.drone,
                    WAIT_TO_CYCLE: true,
                    AUTOFIRE: true,
                    MAX_CHILDREN: 2,
                    SYNCS_SKILLS: true
                }
            }
        )),
        TURRETS: Array(6).fill().map((_, i) => (
            {
                POSITION: [5, 10, 0, 60*i+30, 0, 0],
                TYPE: "rogueBarricadeTurret",
            }
        )),
    }
    Class.rogueBalustradeTurret = {
        PARENT: "genericTank",
        LABEL: "Turret",
        INDEPENDENT: true,
        COLOR: "grey",
        GUNS: [
            {
                POSITION: [18, 16, 1, 0, 0, 0, 0],
            }, {
                POSITION: [2, 16, 1.2, 18, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.block, g.fast, g.hexatrap]),
                    TYPE: "unsetTrap",
                    STAT_CALCULATOR: gunCalcNames.trap,
                    AUTOFIRE: true,
                },
            },
        ],
    }
    Class.rogueBalustrade = {
        PARENT: "miniboss",
        LABEL: "Rogue Balustrade",
        COLOR: "darkGrey",
        UPGRADE_COLOR: "darkGrey",
        SHAPE: 6,
        SIZE: 30,
        VALUE: 5e5,
        CONTROLLERS: ['nearestDifferentMaster', 'onlyAcceptInArc'],
        BODY: {
            FOV: 1.7,
            SPEED: 0.08 * base.SPEED,
            HEALTH: 11 * base.HEALTH,
            SHIELD: 2 * base.SHIELD,
            DAMAGE: 4 * base.DAMAGE,
        },
        GUNS: Array(6).fill().map((_, i) => ([
            {
                POSITION: [4, 6, 1.3, 8, 0, 60*i, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.drone, g.pound, {size: 1.3}]),
                    TYPE: ["turretedDrone", {INDEPENDENT: true}],
                    STAT_CALCULATOR: gunCalcNames.drone,
                    WAIT_TO_CYCLE: true,
                    AUTOFIRE: true,
                    MAX_CHILDREN: 3,
                    SYNCS_SKILLS: true
                }
            }, {
                POSITION: [2.6, 5, 1, 8, 0, 60*i, 0],
            }
        ])).flat(),
        TURRETS: Array(6).fill().map((_, i) => (
            {
                POSITION: [5, 10, 0, 60*i+30, 0, 0],
                TYPE: "rogueBalustradeTurret",
            }
        )),
    }

    // Septa rogues
    Class.rogueBattalionTurret = {
        PARENT: ["genericTank"],
        LABEL: "Turret",
        INDEPENDENT: true,
        COLOR: "grey",
        GUNS: [
            {
                POSITION: [16, 14, 1, 0, 0, 0, 0],
            }, {
                POSITION: [4, 14, 1.6, 16, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.pound, g.destroy, g.hexatrap, g.fast, {size: 2, shudder: 0.6, damage: 0.6}]),
                    TYPE: "trap",
                    STAT_CALCULATOR: gunCalcNames.trap,
                    AUTOFIRE: true,
                },
            },
        ],
    }
    Class.rogueBattalion = {
        PARENT: "miniboss",
        LABEL: "Rogue Battalion",
        COLOR: "darkGrey",
        UPGRADE_COLOR: "darkGrey",
        SHAPE: 7,
        SIZE: 32,
        VALUE: 5e5,
        CONTROLLERS: ['nearestDifferentMaster', 'onlyAcceptInArc'],
        BODY: {
            FOV: 1.3,
            SPEED: base.SPEED * 0.08,
            HEALTH: base.HEALTH * 18,
            SHIELD: base.SHIELD * 4,
            REGEN: base.REGEN * 1.5,
            DAMAGE: base.DAMAGE * 4,
        },
        GUNS: Array(7).fill().map((_, i) => (
            {
                POSITION: [13, 6, 1, 0, 0, 360/7*(i+0.5), 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.pound, g.destroy]),
                    TYPE: "bullet",
                }
            }
        )),
        TURRETS: Array(7).fill().map((_, i) => (
            {
                POSITION: [5, 10, 0, 360/7*i, 0, 0],
                TYPE: "baseTrapTurret",
            }
        )),
    }
    Class.rogueCoalitionTurret = {
        PARENT: "genericTank",
        LABEL: "Turret",
        INDEPENDENT: true,
        COLOR: "grey",
        GUNS: [
            {
                POSITION: [10, 14, -0.5, 9, 0, 0, 0],
            }, {
                POSITION: [17, 15, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.destroy, g.arty, g.arty, g.skim, g.halfreload, {damage: 0.55}]),
                    TYPE: "missile",
                    STAT_CALCULATOR: gunCalcNames.sustained,
                    AUTOFIRE: true,
                },
            },
        ],
    }
    Class.rogueCoalition = {
        PARENT: "miniboss",
        LABEL: "Rogue Coalition",
        COLOR: "darkGrey",
        UPGRADE_COLOR: "darkGrey",
        SHAPE: 7,
        SIZE: 32,
        VALUE: 5e5,
        CONTROLLERS: ['nearestDifferentMaster', 'onlyAcceptInArc'],
        BODY: {
            FOV: 1.5,
            SPEED: base.SPEED * 0.14,
            HEALTH: base.HEALTH * 11,
            SHIELD: base.SHIELD * 2.5,
            REGEN: base.REGEN * 0.7,
            DAMAGE: base.DAMAGE * 2.5,
        },
        GUNS: Array(7).fill().map((_, i) => ([
            {
                POSITION: [11.5, 6, 1, 0, 0, 360/7*(i+0.5), 0],
            }, {
                POSITION: [1, 6, 1.15, 11.5, 0, 360/7*(i+0.5), 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.block, g.construct, g.pound]),
                    TYPE: "unsetTrap",
                    STAT_CALCULATOR: gunCalcNames.block,
                }
            }
        ])).flat(),
        TURRETS: Array(7).fill().map((_, i) => (
            {
                POSITION: [5, 10, 0, 360/7*i, 0, 0],
                TYPE: "rogueCoalitionTurret",
            }
        )),
    }

    // Octo rogues
    Class.rogueAlchemist = {
        PARENT: "miniboss",
        LABEL: "Rogue Alchemist",
        COLOR: "darkGrey",
        UPGRADE_COLOR: "darkGrey",
        SHAPE: 8,
        SIZE: 34,
        VALUE: 5e5,
        CONTROLLERS: ['nearestDifferentMaster', 'onlyAcceptInArc'],
        BODY: {
            FOV: 1.6,
            SPEED: base.SPEED * 0.14,
            HEALTH: base.HEALTH * 16,
            SHIELD: base.SHIELD * 3,
            REGEN: base.REGEN * 1,
            DAMAGE: base.DAMAGE * 3.5,
        },
        GUNS: Array(8).fill().map((_, i) => ([
            {
                POSITION: [11.5, 6, 1, 0, 0, 45*i, 0],
            }
        ])).flat(),
        TURRETS: Array(8).fill().map((_, i) => (
            {
                POSITION: [5, 10, 0, 45*(i+0.5), 0, 0],
                TYPE: "rogueCoalitionTurret",
            }
        )),
    }
    Class.rogueInventor = {
        PARENT: "miniboss",
        LABEL: "Rogue Inventor",
        COLOR: "darkGrey",
        UPGRADE_COLOR: "darkGrey",
        SHAPE: 8,
        SIZE: 34,
        VALUE: 5e5,
        CONTROLLERS: ['nearestDifferentMaster', 'onlyAcceptInArc'],
        BODY: {
            FOV: 1.6,
            SPEED: base.SPEED * 0.14,
            HEALTH: base.HEALTH * 16,
            SHIELD: base.SHIELD * 3,
            REGEN: base.REGEN * 1,
            DAMAGE: base.DAMAGE * 3.5,
        },
        GUNS: Array(8).fill().map((_, i) => ([
            {
                POSITION: [11.5, 6, 1, 0, 0, 45*i, 0],
            }
        ])).flat(),
        TURRETS: Array(8).fill().map((_, i) => (
            {
                POSITION: [5, 10, 0, 45*(i+0.5), 0, 0],
                TYPE: "rogueCoalitionTurret",
            }
        )),
    }
    Class.roguePioneer = {
        PARENT: "miniboss",
        LABEL: "Rogue Pioneer",
        COLOR: "darkGrey",
        UPGRADE_COLOR: "darkGrey",
        SHAPE: 8,
        SIZE: 34,
        VALUE: 5e5,
        CONTROLLERS: ['nearestDifferentMaster', 'onlyAcceptInArc'],
        BODY: {
            FOV: 1.6,
            SPEED: base.SPEED * 0.14,
            HEALTH: base.HEALTH * 16,
            SHIELD: base.SHIELD * 3,
            REGEN: base.REGEN * 1,
            DAMAGE: base.DAMAGE * 3.5,
        },
        GUNS: Array(8).fill().map((_, i) => ([
            {
                POSITION: [11.5, 6, 1, 0, 0, 45*i, 0],
            }
        ])).flat(),
        TURRETS: Array(8).fill().map((_, i) => (
            {
                POSITION: [5, 10, 0, 45*(i+0.5), 0, 0],
                TYPE: "rogueCoalitionTurret",
            }
        )),
    }

    
    Class.rogues.UPGRADES_TIER_0.splice(1, 0, "rogueBarricade", "rogueBalustrade");
    Class.rogues.UPGRADES_TIER_0.splice(4, 0, "rogueBattalion", "rogueCoalition");
    Class.rogues.UPGRADES_TIER_0.splice(7, 0, "rogueAlchemist", "rogueInventor", "roguePioneer");
}