import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { createRoot, Root } from "react-dom/client";
import FluentTagInput from "./FluentTagInput";
import * as React from "react";

export class Tags
  implements ComponentFramework.StandardControl<IInputs, IOutputs>
{
  private container: HTMLDivElement;
  private root: Root;
  private currentValue = "";
  private notifyOutputChanged!: () => void;

  /**
   * Empty constructor.
   */
  constructor() {
    // Empty
  }

  /**
   * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
   * Data-set values are not initialized here, use updateView.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
   * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
   * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
   * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
   */
  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ): void {
    this.container = container;
    this.notifyOutputChanged = notifyOutputChanged;
    this.root = createRoot(this.container);
    this.currentValue = context.parameters.tagValue.raw ?? "";
  }

  /**
   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
   */
  public updateView(context: ComponentFramework.Context<IInputs>): void {
    const value = context.parameters.tagValue.raw ?? "";
    const entityName =
                      (context.mode as ComponentFramework.Mode & {
                        _modeData?: { entityTypeName?: string };
                      })?._modeData?.entityTypeName ?? "unknown";

    const isDisabled = context.mode.isControlDisabled;

    this.root.render(
      React.createElement(FluentTagInput, {
        value: value,
        entityName: entityName,
        onChange: (newValue: string) => {
          this.currentValue = newValue;
          this.notifyOutputChanged();
        },
        disabled: isDisabled, 
      })
    );
  }

  /**
   * It is called by the framework prior to a control receiving new data.
   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
   */
  public getOutputs(): IOutputs {
    return {
      tagValue: this.currentValue,
    };
  }

  /**
   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
   * i.e. cancelling any pending remote calls, removing listeners, etc.
   */
  public destroy(): void {
    // Add code to cleanup control if necessary
    if (this.root) {
      this.root.unmount();
    }
  }
}
