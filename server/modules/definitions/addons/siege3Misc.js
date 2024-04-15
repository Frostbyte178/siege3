const { combineStats, makeAuto } = require('../facilitators.js');
const { base, gunCalcNames } = require('../constants.js');
const g = require('../gunvals.js');

// Controllers
class io_circleTarget extends IO {
    constructor(body, opts = {}) {
        super(body);
        this.orbitRange = opts.range ?? 400;
        this.turnwise = opts.turnwise ?? 1;
    }
    think(input) {
        if (input.target != null) {
            let target = new Vector(input.target.x, input.target.y);
            // Set target
            let distanceToRange = target.length - this.orbitRange,
                targetBearing = util.clamp(distanceToRange / 200, -Math.PI / 2, Math.PI / 2) - Math.PI / 2 * this.turnwise,
                targetAngle = targetBearing + target.direction,
                newX = target.length * Math.cos(targetAngle),
                newY = target.length * Math.sin(targetAngle);
            // Set goal
            let dir = this.turnwise * target.direction + 0.05;
            let goal = {
                x: this.body.x + target.x - this.orbitRange * Math.cos(dir),
                y: this.body.y + target.y - this.orbitRange * Math.sin(dir),
            }
            
            return {
                goal,
                target: {x: newX, y: newY},
            }
        }
    }
}
ioTypes.circleTarget = io_circleTarget;

class io_bombingRun extends IO {
    constructor(body, opts = {}) {
        super(body);
        this.goAgainRange = opts.goAgainRange ?? 1200;
        this.breakAwayRange = opts.breakAwayRange ?? 350;
        this.firingRange = opts.firingRange ?? 400;
        this.breakAwayAngle = opts.breakAwayAngle ?? 45;
        this.alwaysFireInRange = opts.alwaysFireInRange ?? false;
        // If we should continue to do bombing runs below 15% health
        this.bombAtLowHealth = opts.bombAtLowHealth ?? false;

        this.currentlyBombing = true;
        this.dodgeDirection = 0;
        this.storedAngle = 0;
        this.breakAwayAngle *= Math.PI / 180;
    }
    think(input) {
        if (input.target != null) {
            let target = new Vector(input.target.x, input.target.y);
            // Set status
            if (target.length < this.breakAwayRange) this.currentlyBombing = false;
            if (target.length > this.goAgainRange && (this.bombAtLowHealth || this.body.health.display() > 0.15)) this.currentlyBombing = true;

            let goal, 
                newX = target.x, 
                newY = target.y;
            if (this.currentlyBombing) {
                goal = {
                    x: target.x + this.body.x,
                    y: target.y + this.body.y,
                };
                this.storedAngle = this.body.facing;
                this.dodgeDirection = this.breakAwayAngle * (ran.random(1) < 0.5 ? 1 : -1);
            } else {
                let exitAngle = this.storedAngle + this.dodgeDirection;
                newX = target.x + this.goAgainRange * Math.cos(exitAngle);
                newY = target.y + this.goAgainRange * Math.sin(exitAngle);
                goal = {
                    x: newX + this.body.x,
                    y: newY + this.body.y,
                };
                // Avoid twitching when at the turnaround range
                if ((goal.x ** 2 + goal.y ** 2) < 400) {
                    newX = target.x;
                    newY = target.y;
                }
            }
            
            return {
                goal,
                target: {x: newX, y: newY},
                alt: (this.alwaysFireInRange || this.currentlyBombing) && target.length < this.firingRange,
            }
        }
    }
}
ioTypes.bombingRun = io_bombingRun;

class io_drag extends IO {
    constructor(body, opts = {}) {
        super(body);
        this.idealRange = opts.range ?? 140;
    }
    think(input) {
        if (input.target != null && input.main) {
            let sizeFactor = Math.sqrt(this.body.master.size / this.body.master.SIZE),
                orbit = this.idealRange * sizeFactor,
                goal,
                power = 1,
                target = new Vector(input.target.x, input.target.y);
            if (input.main) {
                // Sit at range from point
                let dir = target.direction;
                goal = {
                    x: this.body.x + target.x - orbit * Math.cos(dir),
                    y: this.body.y + target.y - orbit * Math.sin(dir),
                }
                if (Math.abs(target.length - orbit) < this.body.size * 2) {
                    power = 0.7
                }
            }
            return {
                fire: target.length >= (orbit + 50),
                alt: target.length <= (orbit + 100),
                goal,
                power,
            }
        }
    }
}
ioTypes.drag = io_drag;

class io_missileGuidance extends IO {
    constructor(body, opts = {}) {
        super(body);
        this.slowTurnDelay = opts.slowTurnDelay || 0;
        this.fastTurnDelay = opts.fastTurnDelay || 1000;
        this.slowTurnRate = opts.slowTurnRate || 0.045;

        this.initTime = Date.now();
    }
    think(input) {
        // If no target then exit
        if (!input.target) return;

        let lifetime = Date.now() - this.initTime;

        let currentAngle = this.body.facing;
        let target = new Vector(input.target.x, input.target.y);
        let desiredAngle = target.direction;
        let targetLength = target.length;

        let newX = 0, newY = 0;

        // If it's before the slow turn phase then don't turn and activate the secondary thruster
        if (lifetime < this.slowTurnDelay) {
            newX = targetLength * Math.cos(currentAngle);
            newY = targetLength * Math.sin(currentAngle);
            return {
                fire: true,
                alt: false,
                target: {x: newX, y: newY},
            }
        }

        this.body.facingType = "toTarget";
        let angleDifference = util.angleDifference(currentAngle, desiredAngle);

        // If it's during the fast turn phase then cancel sideways velocity and activate the primary thruster
        if (lifetime > this.fastTurnDelay) {
            angleDifference = util.angleDifference(this.body.velocity.direction, desiredAngle);
            let newAngle = desiredAngle + util.clamp(angleDifference, -0.5, 0.5);
            newX = targetLength * Math.cos(newAngle);
            newY = targetLength * Math.sin(newAngle);
            return {
                fire: false,
                alt: true,
                target: {x: newX, y: newY},
            }
        }

        // Otherwise slowly turn to the target angle and activate the secondary thruster
        let turnRate = util.clamp(angleDifference, -this.slowTurnRate, this.slowTurnRate);
        let newAngle = currentAngle + turnRate;
        newX = targetLength * Math.cos(newAngle);
        newY = targetLength * Math.sin(newAngle);
        return {
            fire: true,
            alt: false,
            target: {x: newX, y: newY},
        }
    }
}
ioTypes.missileGuidance = io_missileGuidance;

module.exports = ({ Class }) => {
    // Projectiles
    Class.trueBomb = {
        PARENT: "bullet",
        GUNS: [
            {
                POSITION: [0, 10, 0, 0, 0, 0, 9999],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, {speed: 0, range: 0.05, health: 1e6, size: 16}]),
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
    Class.autoTrap = makeAuto(Class.trap, "autoTrap", 'droneAutoTurret');
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
                POSITION: [14, 6, 1, 0, 0, 180, 1.5],
                PROPERTIES: {
                    AUTOFIRE: true,
                    SHOOT_SETTINGS: combineStats([g.basic, g.skim, g.lowpower, g.muchmorerecoil, g.morespeed]),
                    TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
                    STAT_CALCULATOR: gunCalcNames.thruster,
                },
            },
        ],
    }
    Class.homingMissile = {
        PARENT: "bullet",
        LABEL: "Homing Missile",
        BODY: { FOV: 10, SPEED: 2, RANGE: 100 },
        CONTROLLERS: ["nearestDifferentMaster", "missileGuidance"],
        FACING_TYPE: "withMotion",
        AI: {chase: true, SKYNET: true, },
        INDEPENDENT: true,
        GUNS: [{
            POSITION: [16.5, 10, 1.5, 0, 0, 180, 0],
            PROPERTIES: {
                STAT_CALCULATOR: gunCalcNames.thruster,
                SHOOT_SETTINGS: combineStats([g.basic, g.missileTrail, g.rocketeerMissileTrail, {reload: 1.6, recoil: 0.8}]),
                TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
            },
        }, {
            POSITION: [16.5, 10, 1.5, 0, 0, 180, 0],
            PROPERTIES: {
                STAT_CALCULATOR: gunCalcNames.thruster,
                SHOOT_SETTINGS: combineStats([g.basic, g.missileTrail, g.rocketeerMissileTrail, {reload: 0.8, recoil: 1.15}]),
                TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
                ALT_FIRE: true,
            },
        }],
        TURRETS: [{
            POSITION: [9, 0, 0, 0, 0, 1],
            TYPE: ["triangle", {COLOR: 16}]
        }]
    }
    Class.fireworkRocket = {
        PARENT: ["missile"],
        LABEL: "Firework Rocket",
        INDEPENDENT: true,
        GUNS: [{
            POSITION: [16.5, 10, 1.5, 0, 0, 180, 7.5],
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
    Class.shockwave = {
        PARENT: 'bullet',
        LABEL: 'Shockwave',
        BODY: {
            DENSITY: 1e10,
            HEALTH: 1e6,
            SHIELD: 1e6,
            REGEN: 1e6,
            RANGE: 15,
            PENETRATION: 1e-3,
        },
        ALPHA: 0.5,
        MOTION_TYPE: 'shockwave',
        HITS_OWN_TYPE: 'hard',
    }

    // Turrets
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
    Class.builderTurret = {
        PARENT: ["genericTank"],
        INDEPENDENT: true,
        COLOR: 'purple',
        GUNS: [
            {
                POSITION: [18, 12, 1, 0, 0, 0, 0],
            }, {
                POSITION: [2, 12, 1.1, 18, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.pound, g.block, g.halfreload, g.halfreload, g.veryfast]),
                    TYPE: "unsetTrap",
                    AUTOFIRE: true,
                },
            },
        ],
    };
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
                    SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.pound, g.assass, g.assass, g.hunter, g.sidewind, {health: 1.5, reload: 0.65}]),
                    TYPE: "snake",
                    STAT_CALCULATOR: gunCalcNames.sustained,
                },
            },
        ],
    }
    Class.homingMissileTurret = {
        PARENT: ["genericTank"],
        BODY: { FOV: 2 * base.FOV },
        COLOR: -1,
        INDEPENDENT: true,
        CONTROLLERS: [ "onlyAcceptInArc", "nearestDifferentMaster" ],
        GUNS: [
            {
                POSITION: [10, 12.5, -0.7, 10, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.launcher, g.rocketeer, {speed: 8, maxSpeed: 2, damage: 0.3, size: 0.7, range: 1.25, reload: 2.5}]),
                    TYPE: "homingMissile",
                    STAT_CALCULATOR: gunCalcNames.sustained,
                    AUTOFIRE: true,
                },
            }, {
                POSITION: [17, 18, 0.65, 0, 0, 0, 0],
            }, {
                POSITION: [13.5, 13, -0.55, 0, 0, 0, 0],
            },
        ],
    }
    Class.undertowTurret = {
        PARENT: ["genericTank"],
        BODY: { FOV: 2 * base.FOV },
        COLOR: -1,
        INDEPENDENT: true,
        CONTROLLERS: [ "onlyAcceptInArc", "nearestDifferentMaster" ],
        GUNS: [
            {
                POSITION: [14, 15, 0.8, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.destroy, {damage: 1/2, speed: 2, maxSpeed: 2}]),
                    TYPE: "bullet",
                },
            }, {
                POSITION: [5, 13, 0, 4, -7.5, 82.5, 0],
            }, {
                POSITION: [5, 13, 0, 4, 7.5, -82.5, 0],
            },
        ],
    }
    Class.nestIndustryTop = {
        PARENT: ["genericTank"],
        COLOR: 14,
        INDEPENDENT: true,
        CONTROLLERS: [["spin", { independent: true, speed: -0.05 }]],
        GUNS: [],
    };
    for (let i = 0; i < 10; i++) {
        Class.nestIndustryTop.GUNS.push({
            POSITION: [7, 7.5, 0.6, 7, 0, 36 * i, i % 2 / 2],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.flank]),
                TYPE: ["swarm", {INDEPENDENT: true}],
                STAT_CALCULATOR: gunCalcNames.swarm,
                AUTOFIRE: true,
            },
        })
    }
    Class.flameTurret = {
        PARENT: ["genericTank"],
        LABEL: "Flamethrower",
        COLOR: 14,
        INDEPENDENT: true,
        GUNS: [
            {
                POSITION: [12, 11, 1.2, 3, 0, 0, 0],
            }, {
                POSITION: [12, 8, 1.25, 8, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.mach, g.mach, {spray: 0.2, shudder: 0.1, speed: 3, maxSpeed: 3, range: 0.25, damage: 6, health: 2/5}]),
                    TYPE: "growBullet",
                    AUTOFIRE: true,
                }
            }
        ],
    };
    Class.xPredatorTurret = {
        PARENT: ["genericTank"],
        LABEL: "Flamethrower",
        CONTROLLERS: ["nearestDifferentMaster"],
        COLOR: 14,
        INDEPENDENT: true,
        GUNS: [
            {
                POSITION: [24, 8, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.sniper, g.hunter, g.hunter2, g.hunter2, g.preda, {range: 2, reload: 0.85}]),
                    TYPE: "bullet"
                }
            }, {
                POSITION: [21, 11, 1, 0, 0, 0, 0.1],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.sniper, g.hunter, g.hunter2, g.preda, {range: 2, reload: 0.85}]),
                    TYPE: "bullet"
                }
            }, {
                POSITION: [18, 14, 1, 0, 0, 0, 0.2],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.sniper, g.hunter, g.preda, {range: 2, reload: 0.85}]),
                    TYPE: "bullet"
                }
            }, {
                POSITION: [10, 14, -1.25, 2, 0, 0, 0]
            }
        ],
    };
    Class.culverinTurret = {
        PARENT: ["genericTank"],
        LABEL: "Shotgun",
        CONTROLLERS: ["nearestDifferentMaster"],
        COLOR: 14,
        INDEPENDENT: true,
        GUNS: [
            {
                POSITION: [4, 3, 1, 11, -3, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.fast, g.shotgun]),
                    TYPE: "bullet",
                },
            }, {
                POSITION: [4, 3, 1, 11, 3, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.fast, g.shotgun]),
                    TYPE: "bullet",
                },
            }, {
                POSITION: [4, 4, 1, 13, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.fast, g.shotgun]),
                    TYPE: "casing",
                },
            }, {
                POSITION: [1, 4, 1, 12, -1, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.fast, g.shotgun]),
                    TYPE: "casing",
                },
            }, {
                POSITION: [1, 4, 1, 11, 1, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.fast, g.shotgun]),
                    TYPE: "casing",
                },
            }, {
                POSITION: [1, 3, 1, 13, -1, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.fast, g.shotgun]),
                    TYPE: "bullet",
                },
            }, {
                POSITION: [1, 3, 1, 13, 1, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.fast, g.shotgun]),
                    TYPE: "bullet",
                },
            }, {
                POSITION: [1, 2, 1, 13, 2, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.fast, g.shotgun]),
                    TYPE: "casing",
                },
            }, {
                POSITION: [1, 2, 1, 13, -2, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.fast, g.shotgun]),
                    TYPE: "casing",
                },
            }, {
                POSITION: [17, 14, 1, 6, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.mach, g.shotgun, g.fake]),
                    TYPE: "casing",
                },
            }, {
                POSITION: [8, 14, -1.3, 4, 0, 0, 0],
            },
        ],
    };
    Class.topplerTurret = {
        PARENT: 'genericTank',
        COLOR: 14,
        INDEPENDENT: true,
        CONTROLLERS: ['nearestDifferentMaster'],
        GUNS: [
            {
                POSITION: [20, 14, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.destroy, g.mini, {reload: 1.15}]),
                    TYPE: "bullet",
                    AUTOFIRE: true,
                }
            }, {
                POSITION: [18, 14, 1, 0, 0, 0, 0.15],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.destroy, g.mini, {reload: 1.15}]),
                    TYPE: "bullet",
                    AUTOFIRE: true,
                }
            }, {
                POSITION: [16, 14, 1, 0, 0, 0, 0.3],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.destroy, g.mini, {reload: 1.15}]),
                    TYPE: "bullet",
                    AUTOFIRE: true,
                }
            }
        ]
    }
};