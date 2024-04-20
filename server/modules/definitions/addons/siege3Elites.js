const { combineStats, skillSet } = require('../facilitators.js');
const { base, gunCalcNames } = require('../constants.js');
const g = require('../gunvals.js');

module.exports = ({ Class }) => {
    Class.eliteOverseer = {
        PARENT: 'elite',
        UPGRADE_LABEL: "Elite Overseer",
        UPGRADE_COLOR: "pink",
        CONTROLLERS: [["minion", {orbit: 600, repel: 610}],["underseerRepel", {repelDrones: 31, minDrones: 12, repelCenterDistance: -0.25}]],
        SKILL: skillSet({
            rld: 0.7,
            dam: 0.5,
            pen: 0.8,
            str: 0.8,
            spd: 1, // default: 0.2
            atk: 0.3,
            hlt: 1,
            shi: 0.7,
            rgn: 0.7,
            mob: 0,
        }),
        BODY: {
            FOV: 2
        },
        AI: { STRAFE: false, IGNORE_SHAPES: true },
        IGNORED_BY_AI: true,
        GUNS: Array(3).fill().flatMap((_, i) => ([
            {
                POSITION: [5, 6, 1.4, 6, 5.5, 120 * i + 60, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.drone, g.over, g.over, {health: 0.8, size: 1.3}]),
                    TYPE: 'drone',
                    MAX_CHILDREN: 4,
                    SYNCS_SKILLS: true,
                    AUTOFIRE: true,
                    STAT_CALCULATOR: gunCalcNames.drone,
                }
            }, {
                POSITION: [5, 6, 1.4, 6, -5.5, 120 * i + 60, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.drone, g.over, g.over, {health: 0.8, size: 1.3}]),
                    TYPE: 'drone',
                    MAX_CHILDREN: 4,
                    SYNCS_SKILLS: true,
                    AUTOFIRE: true,
                    STAT_CALCULATOR: gunCalcNames.drone,
                }
            }, {
                POSITION: [5, 8, 1.4, 8, 0, 120 * i + 60, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.drone, g.over, g.over, {health: 0.8, size: 1.3}]),
                    TYPE: 'drone',
                    MAX_CHILDREN: 4,
                    SYNCS_SKILLS: true,
                    AUTOFIRE: true,
                    STAT_CALCULATOR: gunCalcNames.drone,
                }
            }
        ])),
        TURRETS: [
            {
                POSITION: [11, 0, 0, 0, 360, 1],
                TYPE: ["auto4gun", { INDEPENDENT: false, COLOR: -1 }],
            },
        ]
    }

    Class.elites.UPGRADES_TIER_0.push("eliteOverseer");
};
