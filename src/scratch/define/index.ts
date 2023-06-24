import { IBlockRegisterProps } from './type';

export const defineBlock = (
  ScratchBlocks: any,
  type: string,
  block: IBlockRegisterProps,
) => {
  ScratchBlocks.Blocks[type] = {
    init() {
      this.jsonInit(block);
    },
  };
};

export * from './type';
