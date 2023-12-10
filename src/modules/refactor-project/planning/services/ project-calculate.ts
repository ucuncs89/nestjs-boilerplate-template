export class ProjectCalculate {
  calculateAvgPrice(entity: any) {
    if (entity && entity.vendor_material) {
      entity.vendor_material.forEach((vendorMaterial) => {
        if (vendorMaterial && vendorMaterial.detail) {
          const totalPrices = vendorMaterial.detail.map(
            (detail) => detail.total_price,
          );
          const avgPrice = this.calculateAverage(totalPrices);
          vendorMaterial.avg_price = avgPrice;
        }
      });
    }

    if (entity) {
      const totalPrices = entity.vendor_material
        ? entity.vendor_material.flatMap((vendorMaterial) =>
            vendorMaterial.detail
              ? vendorMaterial.detail.map((detail) => detail.total_price)
              : [],
          )
        : [];
      const avgPrice = this.calculateAverage(totalPrices);
      entity.avg_price = avgPrice;
    }
  }

  private calculateAverage(prices: number[]): number {
    if (prices.length === 0) {
      return 0;
    }

    const sum = prices.reduce((acc, price) => acc + price, 0);
    return sum / prices.length;
  }
}
