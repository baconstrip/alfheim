import GameObjectInstance from "./gameobjectinstance";
import { SendInventory, InventoryObject} from "../../common/messages";

/**
 * Represents the current contents of something, may be a player, room, or 
 * object.
 */
export default class Inventory {
    size: number;
    contents: GameObjectInstance[] = [];

    constructor(size: number) {
        this.size = size;
    }

    /**
     * Moves a reference to the item from one inventory to another.
     * Returns whether or not the transfer was successful.
     */
    transferTo(other: Inventory, o: GameObjectInstance): boolean {
        if (other.isFull()) {
            return false;
        }
        const idx = this.contents.findIndex(x => x == o);
        if (idx == -1) {
            return false;
        }

        // Remove the contents of this inventory;
        this.contents.splice(idx, 1);

        other.contents.push(o);

        return true;
    }

    /**
     * Adds an item to the inventory, without moving it from somewhere. Useful
     * for spawning in an item. Returns whether the add was successful.
     */
    addItem(o: GameObjectInstance): boolean {
        if (this.isFull()) {
            return false;
        }

        this.contents.push(o);

        return true;
    }

    isFull(): boolean {
        return this.size == this.contents.length;
    }

    toClientMessage(): SendInventory {
        const inv = new SendInventory();
        inv.size = this.size;

        inv.items = this.contents.map((x): InventoryObject => {
            const obj = new InventoryObject();
            obj.name = x.forObject.name;
            obj.description = x.forObject.description;
            return obj;
        });
        return inv;
    }
}