import { BaseIntegration } from "@brux/shared/src/schemas/schema";
import { BaseModule } from "../schemas/baseModule";
import { GoogleSheetCatalogElement } from "./google-sheets/infos";
import { CellReadModule } from "./google-sheets/modules/cell-read";
import { CellWriteModule } from "./google-sheets/modules/cell-write";
import { RowReadModule } from "./google-sheets/modules/row-read";
import { PayfitCatalogElement } from "./payfit/info";

export const baseIntegrationCatalog: BaseIntegration[] = [
    GoogleSheetCatalogElement,
    PayfitCatalogElement
]

export const baseModuleCatalog: BaseModule[] = [
    CellReadModule,
    CellWriteModule,
    RowReadModule,
]