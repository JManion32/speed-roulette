// Prevents error when importing pngs
declare module "*.png" {
    const value: string;
    export default value;
}
