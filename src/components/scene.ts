import { PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Scene, Color } from "three";
import { ThreeObject3DBase } from "../utils/base/object-3d";

@customElement("three-scene")
export class ThreeScene extends ThreeObject3DBase<Scene> {
  protected override _object = new Scene();

  #background?: string;
  @property({ reflect: true })
  set background(value: string | undefined) {
    this.#background = value;
    if (!this._object) {
      return;
    }
    this._object.background = (this._obtainAsset(this.#background) ??
      new Color(this.#background) ??
      null) as any;
    this._rendererContext?.rerender();
  }
  get background() {
    return this.#background;
  }

  protected firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);
    this._rendererContext?.updateScene(this._object);
    this._rendererContext?.watchAssetChange((id) =>
      this.#handleAssetsChange(id)
    );
  }

  #handleAssetsChange(id: string) {
    if (!this._object) {
      return;
    }
    switch (id) {
      case this.background:
        this._object.background = (this._obtainAsset(this.background) ??
          new Color(this.background) ??
          null) as any;
        this._rendererContext?.rerender();
        break;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "three-scene": ThreeScene;
  }
}