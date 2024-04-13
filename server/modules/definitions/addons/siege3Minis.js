// Marketable plushies at a REASONABLE COST?????

const { combineStats } = require('../facilitators.js');
const { base, gunCalcNames } = require('../constants.js');
const g = require('../gunvals.js');

module.exports = ({ Class }) => {

// Prebuild weapons

Class.desmosTurret = {
    PARENT: ["genericTank"],
    LABEL: "Turret",
    BODY: {
        FOV: 0.5,
    },
    INDEPENDENT: true,
    CONTROLLERS: ["nearestDifferentMaster", 'onlyAcceptInArc'],
    COLOR: "grey",
    AI: {
        SKYNET: true,
        FULL_VIEW: true,
    },
    GUNS: [
        {
            POSITION: [26, 10, 0.8, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.lowpower, g.halfreload]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [3.75, 10, 2.125, 2.25, -10.25, 90, 0]
        },
        {
            POSITION: [3.75, 10, 2.125, 2.25, 10.25, -90, 0]
        }
    ],
};

    // New module because the old one won't render all of them

Class.siege3sentries = {
    PARENT: ["menu"],
    LABEL: "Sentries (2)",
    COLOR: "pink",
    UPGRADE_COLOR: "pink",
    SHAPE: 3.5,
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: "genericEntity",
        },
    ],
};


    // Sentries
	
    Class.sentryThruster = {
    PARENT: ["sentry"],
    UPGRADE_LABEL: "Thruster Sentry",
    UPGRADE_COLOR: "pink",
    GUNS: [
        {
            POSITION: [7, 18, -.6, 7, 0, 180, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.mach, g.morerecoil, g.lowpower, g.swarm]),
                TYPE: "bullet",
                STAT_CALCULATOR: gunCalcNames.swarm,
            },
        },
        {
            POSITION: [9, 12, -.6, 7, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.mach, g.morerecoil, g.lowpower, g.swarm]),
                TYPE: "bullet",
                STAT_CALCULATOR: gunCalcNames.swarm,
            },
        },
    ],
};

    Class.sentryRoadspike = {
    PARENT: ["sentry"],
    UPGRADE_LABEL: "Caltrop Sentry",
    UPGRADE_COLOR: "pink",
    GUNS: [
        {
            POSITION: [13.5, 12, 1, 0, 0, 180, 0],
        },
        {
            POSITION: [4, 12, 1.8, 13.5, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.mach, g.trap, g.lowpower, g.halfspeed, g.halfspeed]),
                TYPE: "trap",
                STAT_CALCULATOR: gunCalcNames.trap,
            },
        },
    ],
};


// makeAuto was being weird.

    Class.sentryDesmos = {
    PARENT: ["sentry"],
    UPGRADE_LABEL: "Desmos Sentry",
    UPGRADE_COLOR: "pink",
    TURRETS: [
        {
                POSITION: [12, 0, 0, 0, 360, 1],
                TYPE: 'desmosTurret'
        },
    ],
};


// Sentinels

Class.sentinelTriplex = {
  PARENT: ["sentinel"],
  UPGRADE_LABEL: "Triplex Sentinel",
  UPGRADE_COLOR: "purple",
  GUNS: [
        {
            POSITION: [21.5, 8, 0.7, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.twin, g.bent]),
                TYPE: "bullet",
            },
        },{
            POSITION: [20, 8, 0.7, 0, 0, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.twin, g.bent]),
                TYPE: "bullet",
            },
        },{
            POSITION: [19, 8, 0.7, 0, 0, 30, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent]),
                TYPE: "bullet",
            },
        },{
            POSITION: [19, 8, 0.7, 0, 0, -30, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.bent]),
                TYPE: "bullet",
            },
        },{
            POSITION: [3.75, 10, 2.125, 0, -4.25, 32, 0],
        },{
            POSITION: [3.75, 10, 2.125, 0, 4.25, -32, 0],
        },{
            POSITION: [7, 5, 0.2, 9.5, 0, 15.5, 0],
        },{
            POSITION: [7, 5, 0.2, 9.5, 0, -15.5, 0],
        },{
            POSITION: [7, 21, 0.5, 4.5, 0, 0, 0],
        },
    ],
};

Class.sentinelBees = {
  PARENT: ["sentinel"],
  UPGRADE_LABEL: "Bee Sentinel",
  UPGRADE_COLOR: "purple",
  GUNS: [
        {
            POSITION: [13, 5, 1.5, 0, -4.5, -1, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.bees]),
                TYPE: ["bee", { INDEPENDENT: true }],
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: gunCalcNames.drone,
                WAIT_TO_CYCLE: true,
                LABEL: "Secondary",
            },
        },
        {
            POSITION: [13, 5, 1.5, 0, 4.5, 1, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.bees]),
                TYPE: ["bee", { INDEPENDENT: true }],
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: gunCalcNames.drone,
                WAIT_TO_CYCLE: true,
                LABEL: "Secondary",
            },
        },{
            POSITION: [7, 20, 0.85, 4, 0, 0, 0],
        },{
            POSITION: [19, 9, 1.1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.arty]),
                TYPE: "bullet",
                LABEL: "Heavy",
            },
        },
  ],
};

// It's 12:55am I don't feel like being creative.

Class.sentinelBomber = {
  PARENT: ["sentinel"],
  UPGRADE_LABEL: "Bomb Sentinel",
  UPGRADE_COLOR: "purple",
  GUNS: [
	{
            POSITION: [18, 7, 1.3, 0, 0, 0, 0],
        },{
      	    POSITION: [15, 12.5, 1.3, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.arty, g.lessreload, {range: 0.8}]),
                TYPE: "trueBomb",
            },
    },
  ],
};



    // Push the sentries and sentinels.
    Class.sentries.UPGRADES_TIER_0.push("siege3sentries");
    Class.siege3sentries.UPGRADES_TIER_0 = ["sentryThruster", "sentryRoadspike", "sentryDesmos", "sentinelTriplex", "sentinelBees", "sentinelBomber"];

}