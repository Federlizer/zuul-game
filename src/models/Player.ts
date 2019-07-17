import readline from 'readline';

import Entity from './Entity';
import BattleAction from '../battle/BattleAction';
import Room from './Room';
import Item, { ItemType } from './Item';

class Player extends Entity {
    inventory: Array<Item>;
    equippedWeapon: Item | null;

    constructor(name: string, health: number, baseDamage: number, startingRoom: Room) {
        super(name, baseDamage, startingRoom, health, 0);

        this.inventory = [];
        this.equippedWeapon = null;
    }

    dealDamage(): number {
        const base = super.dealDamage();

        if (this.equippedWeapon !== null)
            return base + this.equippedWeapon.power;
        return base;
    }

    async getInput(): Promise<string> {
        return new Promise((resolve, _) => {
            const prompt = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });

            prompt.question("> ", (answer) => {
                prompt.close()

                resolve(answer);
            })
        })
    }

    async getAction(): Promise<BattleAction> {
        return new Promise((resolve, _) => {
            const prompt = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });

            prompt.question("> ", (answer) => {
                prompt.close();

                switch (answer) {
                    case 'attack':
                        resolve(BattleAction.Attack);
                        break;
                    case 'heal':
                        resolve(BattleAction.Heal);
                        break;
                    default:
                        resolve(BattleAction.NoAction);
                }
            });
        });
    }

    takeItem(item: Item) {
        this.inventory = [...this.inventory, item];
    }

    equip(itemID: string): boolean {
        let equipped = false;
        this.inventory.map((item) => {
            if (item.id === itemID) {
                if (!item.equipable) {
                    console.log('This item isn\'t equipable, try using it instead.');
                    return false;
                }

                switch (item.type) {
                    case ItemType.Weapon:
                        console.log(`Equipped ${item.name}.`);
                        this.equippedWeapon = item;
                        equipped = true;
                        break;
                    case ItemType.Armor:
                        console.log(`Equipped ${item.name}.`);
                        this.armor = item.power;
                        equipped = true;
                        break;
                    default:
                        console.log(`Unknown item type ${item.type}.`);
                        equipped = false;
                        break;
                }
            }
        })
        if (equipped) {
            return true;
        } else {
            console.log(`Item with ID ${itemID} wasn't found.`);
            return false;
        }
    }

    use(itemID: string): boolean {
        this.inventory.map((item) => {
            if (item.id === itemID) {
                if (item.equipable) {
                    console.log('You can\'t use this item, try equipping it instead');
                    return false;
                }

                switch (item.type) {
                    case ItemType.Healing:
                        this.heal(item.power);
                        return true;
                    default:
                        console.log(`Unknown item type ${item.type}.`);
                        return false;
                }
            }
        })
        console.log(`Item with ID ${itemID} wasn't found.`);
        return false;
    }
}

export default Player;