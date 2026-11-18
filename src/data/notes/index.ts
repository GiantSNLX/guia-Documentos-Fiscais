import { nfeModel } from './nfe';
import { nfceModel } from './nfce';
import { nfseModel } from './nfse';
import { cteModel } from './cte';
import { mdfeModel } from './mdfe';
import type { NoteModel, NoteModelId } from '../../types/fiscal';

export const NOTE_MODELS: NoteModel[] = [
  nfeModel,
  nfceModel,
  nfseModel,
  cteModel,
  mdfeModel,
];

export const NOTE_MODELS_BY_ID: Record<NoteModelId, NoteModel> = {
  nfe: nfeModel,
  nfce: nfceModel,
  nfse: nfseModel,
  cte: cteModel,
  mdfe: mdfeModel,
};
