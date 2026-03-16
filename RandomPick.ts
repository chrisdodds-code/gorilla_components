//------------------------------------------------------------------------------
// RandomPick
// Randomly selects one item from a comma-separated list and saves it to a store field
// Gorilla can be slow to load items from the store, so especially if using images the 
// best way to use this component is to add it to a blank screen before the 
// screen that displays the stimulus.
// The component allows you to enter a list of comma-separated digits, strings or image filenames
// and save them to a field in the store, which can then be used in a text or image display
//------------------------------------------------------------------------------
import { registerSimple, registerEditor, component, ScreenComponent, ScreenComponentFactory } from "@gorilla/compiled/task-builder.js";

export interface RandomPickFactory extends ScreenComponentFactory {
  items: string
  destination: string
}

@component('base.component.RandomPick')
export class RandomPick extends ScreenComponent<RandomPickFactory> {
  public screenStart() {
    if (this.runtimeModeOrEditorPlaying) {
      const items = this.injectBindings(this.factory.items)
        .split(',')
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0)
      if (items.length > 0) {
        const randomIndex = Math.floor(Math.random() * items.length)
        const picked = items[randomIndex]
        console.log('items:', items, 'picked:', picked)
        const dest = this.createBinding()
        dest.parseIfExists(this.factory.destination)
        dest.write(picked)
      }
    }
  }
}

registerEditor('RandomPick', {
  label: 'Random Pick',
  icon: 'fas fa-random',
  form: {
    elements: [
      {
        class: "FormElementBindableText",
        field: "items",
        label: "Items (comma separated, e.g. cat, dog, house)"
      },
      { class: "FormElementBindableField", field: "destination", label: "Destination Store Field" }
    ]
  }
})

registerSimple('screenComponent', 'RandomPick', {
  description: 'Randomly picks one item from a comma-separated list and saves it to a Store field',
})
