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

Class.leviathanRocket = {
    PARENT: ["bullet"],
    LABEL: "Leviathan Rocket",
    TYPE: "swarm",
    BODY:{
    HEALTH: .5,
    },
    MOTION_TYPE: "swarm",
    INDEPENDENT: true,
    GUNS: [{
        POSITION: [6, 12, 1.4, 8, 0, 180, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            STAT_CALCULATOR: gunCalcNames.thruster,
            SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.halfreload, g.lotsmorrecoil, { range: 0.1}]),
            TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
            }}],
};

Class.chargerTrap = {
    PARENT: ["trap"],
    LABEL: "Charger",
    SHAPE: -4,
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
        }})}

Class.fireworkRocket = {
    PARENT: ["bullet"],
    LABEL: "Firework Rocket",
    TYPE: "swarm",
    MOTION_TYPE: "swarm",
    INDEPENDENT: true,
    GUNS: [{
        POSITION: [6, 12, 1.4, 8, 0, 180, 0],
        PROPERTIES: {
            AUTOFIRE: true,
            STAT_CALCULATOR: gunCalcNames.thruster,
            SHOOT_SETTINGS: combineStats([g.basic, g.machgun, g.mach, g.morereload, { range: 0.3, recoil: 1 }]),
            TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
            },
	},
    ],
    TURRETS: [{
	    POSITION: [8, 0, 0, 0, 0, 1],
            TYPE: [ "egg", { COLOR: 16 }, ],
	}
    ],
};
for(let i = 0; i < 16; i++) {
    Class.fireworkRocket.GUNS.push({
        POSITION: [0, (i % 4) + 1, 0, 0, 0, 0, 9999],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun, { spray: 1e6, recoil: 0, range: 0.5 }]),
            TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
            SHOOT_ON_DEATH: true,
        }})}

Class.fireworkTurret = {
    PARENT: ["genericTank"],
    LABEL: "Skimmer",
    BODY: { FOV: 2 * base.FOV },
    COLOR: -1,
    CONTROLLERS: [ "canRepel", "onlyAcceptInArc", "mapAltToFire", "nearestDifferentMaster" ],
    GUNS: [
        {
            POSITION: [12, 10, 1.4, 8, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.destroy, g.rocketeer, g.veryfast, g.veryfast, g.fast, g.halfreload]),
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
        }})}

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
            TYPE: [ "volute", { INDEPENDENT: true, COLOR: -1 }, {CONTROLLERS: ["canRepel", "onlyAcceptInArc", "mapAltToFire", "nearestDifferentMaster"]}, ],
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
	    SHOOT_SETTINGS: combineStats([g.basic, g.sniper]),
            TYPE: [ "assassin", { INDEPENDENT: true, COLOR: -1 }, {CONTROLLERS: ["canRepel", "onlyAcceptInArc", "mapAltToFire", "nearestDifferentMaster"]}, ],
        }
    );
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
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: [ "fireworkTurret", { INDEPENDENT: true, COLOR: -1 } ],
        },
    ],
};
for(let i = 0; i < 5; i++) {
    Class.nestGrenadier.GUNS.push({
            POSITION: [6, 5*1.1, 1.4, 4, 0, 72*i+36, 0],
        },{
            POSITION: [2, 8, 1.4, 6*1.05+4, 0, 72*i+36, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machgun, { size: 0.25 } ]),
                TYPE: "trap"
            },
        }
    );
    Class.nestGrenadier.TURRETS.push(
        {
            POSITION: [8, 9, 0, 72*i, 120, 0],
            TYPE: [ "nailgun", { INDEPENDENT: true, COLOR: -1 }, {CONTROLLERS: ["canRepel", "onlyAcceptInArc", "mapAltToFire", "nearestDifferentMaster"]}, ],
        }
    );
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
            TYPE: [ "sidewinder", { INDEPENDENT: true, COLOR: -1 }, {CONTROLLERS: ["canRepel", "onlyAcceptInArc", "mapAltToFire", "nearestDifferentMaster"]}, ],
        },
    ],
};
for(let i = 0; i < 5; i++) {
    Class.nestBrigadier.GUNS.push({
            POSITION: [1.5, 9, 1, 9.5, 0, 72*i+36, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap,  g.block, g.halfspeed, g.halfspeed, g.halfspeed, g.slow, { size: 0.75 } ]),
                TYPE: "minimissile",
                STAT_CALCULATOR: gunCalcNames.block
            },
        },
    );
    Class.nestBrigadier.TURRETS.push(
        {
            POSITION: [8, 9, 0, 72*i, 120, 0],
            TYPE: [ "desmos", { INDEPENDENT: true, COLOR: -1 }, {CONTROLLERS: ["canRepel", "onlyAcceptInArc", "mapAltToFire", "nearestDifferentMaster"]}, ],
        }
    );
};

//Push Nester to Nesters.
	Class.nesters.UPGRADES_TIER_0.push("nestPurger", "nestGrenadier", "nestBrigadier");
}