import { Ploc } from "../../common/presentation/Ploc";
import {
  TagState,
  LoadingTagState,
  LoadedTagState,
  ErrorTagState,
  tagInitialState,
} from "./TagState";
import { GetTagsUseCase } from "../domain/usecases/GetTagsUseCase";
import { CreateTagUseCase } from "../domain/usecases/CreateTagUseCase";
import { UpdateTagUseCase } from "../domain/usecases/UpdateTagUseCase";
import { DeleteTagUseCase } from "../domain/usecases/DeleteTagUseCase";
import { CreateTagData, UpdateTagData } from "../domain/Tag";

export class TagPloc extends Ploc<TagState> {
  constructor(
    private getTagsUseCase: GetTagsUseCase,
    private createTagUseCase: CreateTagUseCase,
    private updateTagUseCase: UpdateTagUseCase,
    private deleteTagUseCase: DeleteTagUseCase,
    private userId: number
  ) {
    super(tagInitialState);
  }

  async loadTags(): Promise<void> {
    this.changeState({ kind: "LoadingTagState" });

    const result = await this.getTagsUseCase.execute(this.userId);

    result.fold(
      (error) => {
        this.changeState({ kind: "ErrorTagState", error: error.error.message });
      },
      (tags) => {
        this.changeState({ kind: "LoadedTagState", tags });
      }
    );
  }

  async createTag(data: CreateTagData): Promise<void> {
    const result = await this.createTagUseCase.execute(data, this.userId);

    result.fold(
      (error) => {
        // Keep current state but could emit error
        console.error("Failed to create tag:", error.error.message);
      },
      (tag) => {
        // Reload tags to get the updated list
        this.loadTags();
      }
    );
  }

  async updateTag(id: number, data: UpdateTagData): Promise<void> {
    const result = await this.updateTagUseCase.execute(id, data, this.userId);

    result.fold(
      (error) => {
        console.error("Failed to update tag:", error.error.message);
      },
      (tag) => {
        // Reload tags to get the updated list
        this.loadTags();
      }
    );
  }

  async deleteTag(id: number): Promise<void> {
    const result = await this.deleteTagUseCase.execute(id, this.userId);

    result.fold(
      (error) => {
        console.error("Failed to delete tag:", error.error.message);
      },
      (success) => {
        // Reload tags to get the updated list
        this.loadTags();
      }
    );
  }
}
