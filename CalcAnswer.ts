///------------------------------------------------------------------------------
// CalcAnswer
// Reads two numbers from the spreadsheet, applies a mathematical operation,
// and saves the result to a Store field for use by the Scorer.
// Requires two columns in spreadsheet each containing a list of input numbers.
// After adding the component to a screen, bind 'Number 1' to one column 
// and 'Number 2' to the other column.
// Then select an operation (multiply/divide/add/subtract).
// Then set a field in the store to save the output (i.e. what the correct response should be)
// You can then set up a scorer component to use the output to determine
// whether the participant made the correct response.
//------------------------------------------------------------------------------
import { registerSimple, registerEditor, component, ScreenComponent, ScreenComponentFactory, ProcessedResponse } from "@gorilla/compiled/task-builder.js";

export interface CalcAnswerFactory extends ScreenComponentFactory {
  number1: string
  number2: string
  operation: string
  destination: string
}

@component('base.component.CalcAnswer')
export class CalcAnswer extends ScreenComponent<CalcAnswerFactory> {
  public screenStart() {
    if (this.runtimeModeOrEditorPlaying) {
      const n1 = Number(this.injectBindings(this.factory.number1))
      const n2 = Number(this.injectBindings(this.factory.number2))
      let product: number
      switch (this.factory.operation) {
        case 'add':      product = n1 + n2; break;
        case 'subtract': product = n1 - n2; break;
        case 'divide':   product = n1 / n2; break;
        default:         product = n1 * n2; break;
      }
      console.log('n1:', n1, 'n2:', n2, 'operation:', this.factory.operation, 'result:', product)
      const dest = this.createBinding()
      dest.parseIfExists(this.factory.destination)
      dest.write(String(product))
    }
  }
}

registerEditor('CalcAnswer', {
  label: 'Calc Answer',
  icon: 'fas fa-calculator',
  form: {
    elements: [
      { class: "FormElementBindableText", field: "number1", label: "Number 1" },
      { class: "FormElementBindableText", field: "number2", label: "Number 2" },
      {
        class: "FormElementDropDown",
        field: "operation",
        label: "Operation",
        options: [
          { label: "Multiply", value: "multiply" },
          { label: "Divide", value: "divide" },
          { label: "Add", value: "add" },
          { label: "Subtract", value: "subtract" },
        ]
      },
      { class: "FormElementBindableField", field: "destination", label: "Destination Store Field" }
    ]
  }
})

registerSimple('screenComponent', 'CalcAnswer', {
  description: 'Applies a mathematical operation to two numbers and saves result to Store',
})
