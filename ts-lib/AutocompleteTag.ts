import { type TagItem } from "./ab-tags-types.ts";

declare const Tagify: any;

export default class AutocompleteTag<IdType extends number|string> {
    #items: Array<TagItem<IdType>>;
    #listeners_OnChange: Array<(evt: Event) => void>;
    #tag: any;

    get value(): TagItem<IdType>|null {
         return this.#tag.value.length === 0 ?
                null : this.#tag.value[0].id;
    }

    constructor(elem: HTMLInputElement) {
        this.#items = [];
        this.#listeners_OnChange = [];
        this.#tag = new Tagify(elem, {
            enforceWhitelist: true,
            mode: 'select',
            whitelist: [],
                })
            .on("change", (evt: Event) => {
                for (let listener of this.#listeners_OnChange)
                    listener(evt);
            })
    }

    addListener_OnChange(listener: (evt: Event) => void): AutocompleteTag<IdType> {
        this.#listeners_OnChange.push(listener);

        return this;
    }

    setItems(items: Array<TagItem<IdType>>): void {
        this.#items = items.map((item) => {
            return {
                id: item.id,
                value: item.value,
            };
        });
        this.#tag.removeAllTags();
        this.#tag.whitelist = items;
    }

    setValue(itemId: number|string|null): void {
        if (itemId === null) {
            this.#tag.removeAllTags();
            return;
        }

        for (let item of this.#items) {
            if (item.id === itemId) {
                this.#tag.addTags([{
                    id: item.id,
                    value: item.value,
                }]);

                return;
            }
        }

        throw Error(`Tag with id '${itemId}' does not exist.`);
    }
}