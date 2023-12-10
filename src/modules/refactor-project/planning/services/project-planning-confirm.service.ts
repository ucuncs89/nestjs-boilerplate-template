import { Injectable } from '@nestjs/common';
import { ProjectDetailEntity } from 'src/entities/project/project_detail.entity';
import { ProjectPriceEntity } from 'src/entities/project/project_price.entity';
import { ProjectShippingEntity } from 'src/entities/project/project_shipping.entity';
import { ProjectVendorProductionEntity } from 'src/entities/project/project_vendor_production.entity';

@Injectable()
export class ProjectPlanningConfirmService {
  async findAndCalculateTotalCost(
    listFabricItem?: any[],
    listSewingItem?: any[],
    listPackagingItem?: any[],
    listFinishedGoodsItem?: any[],
    sumQuantity?: number,
    listProduction?: ProjectVendorProductionEntity[],
    projectSelling?: ProjectPriceEntity,
    projectDetail?: ProjectDetailEntity,
    listDelivery?: ProjectShippingEntity[],
  ) {
    const fabricCost = await this.calculateMaterialItemCost(
      listFabricItem,
      projectDetail.fabric_percentage_of_loss,
    );
    const sewingCost = await this.calculateMaterialItemCost(
      listSewingItem,
      projectDetail.sewing_accessories_percentage_of_loss,
    );
    const packagingCost = await this.calculateMaterialItemCost(
      listPackagingItem,
      projectDetail.packaging_accessories_percentage_of_loss,
    );
    const finishedGoodsCost = await this.calculateMaterialItemCost(
      listFinishedGoodsItem,
      projectDetail.finished_goods_percentage_of_loss,
    );
    const productionCost = await this.calculateProductionItemCost(
      listProduction,
    );
    const deliveryCost = await this.calculateDelivery(
      listDelivery,
      sumQuantity,
    );

    const totalMaterialCost =
      fabricCost.total_material_cost +
      sewingCost.total_material_cost +
      packagingCost.total_material_cost +
      finishedGoodsCost.total_material_cost;
    const totalCostOfGoodsSold =
      totalMaterialCost +
      productionCost.total_production_cost +
      deliveryCost.total_delivery_cost_all_items;
    const totalAdditionalPrice = projectSelling.additional_price.reduce(
      (sum, item) => sum + item.additional_price,
      0,
    );

    const profit_unit = {
      selling_price: projectSelling.selling_price_per_item,
      loss_percentage: projectSelling.loss_percentage,
      total_profit_unit:
        projectSelling.selling_price_per_item -
        totalCostOfGoodsSold -
        (totalCostOfGoodsSold * projectSelling.loss_percentage) / 100,
    };

    const cost_of_goods_sold_all_item = {
      item_request: sumQuantity,
      total_cost_of_goods_sold: totalCostOfGoodsSold,
      total_cost_of_goods_sold_all_item: totalCostOfGoodsSold * sumQuantity,
    };

    const sales_of_all_items = {
      total_items: sumQuantity,
      selling_price: projectSelling.selling_price_per_item,
      total_sales: sumQuantity * projectSelling.selling_price_per_item,
    };

    const additional_price = {
      detail: projectSelling.additional_price,
      total_additional_price: totalAdditionalPrice,
    };

    const gross_profit_loss = {
      total_sales: sales_of_all_items.total_sales,
      total_cost_of_goods_sold_all_item:
        cost_of_goods_sold_all_item.total_cost_of_goods_sold_all_item,
      total_gross_profit:
        sales_of_all_items.total_sales -
        cost_of_goods_sold_all_item.total_cost_of_goods_sold_all_item,
    };

    const profit_loss = {
      total_items: sumQuantity,
      profit_unit: profit_unit.selling_price,
      delivery_cost_all_item: deliveryCost.total_delivery_cost_all_items,
      additional_price: additional_price.total_additional_price,
      total_profit_loss:
        sumQuantity * profit_unit.selling_price -
        deliveryCost.total_delivery_cost_all_items -
        additional_price.total_additional_price,
    };

    return {
      fabric_cost: fabricCost,
      sewing_cost: sewingCost,
      packaging_cost: packagingCost,
      finished_goods_cost: finishedGoodsCost,
      production_cost: productionCost,
      delivery_cost: deliveryCost,
      cost_of_goods_sold: {
        total_fabric_cost: fabricCost.total_material_cost,
        total_sewing_cost: sewingCost.total_material_cost,
        total_packaging_cost: packagingCost.total_material_cost,
        total_finished_good_cost: finishedGoodsCost.total_material_cost,
        total_production_cost: productionCost.total_production_cost,
        total_delivery_cost: deliveryCost.total_delivery_cost_all_items,
        total_cost_of_goods_sold: totalCostOfGoodsSold,
      },
      profit_unit,
      cost_of_goods_sold_all_item,
      sales_of_all_items,
      additional_price,
      gross_profit_loss,
      profit_loss,
    };
  }

  async calculateMaterialItemCost(
    listMaterialItem: any[],
    percentage_of_loss: number,
  ) {
    const arrResult = [];

    if (listMaterialItem.length < 1) {
      return {
        detail: arrResult,
        percentage_of_loss: 0,
        total_material_cost: 0,
        total_cost: 0,
      };
    }

    for (const item of listMaterialItem) {
      item.vendor_material.forEach((vendorMaterial) => {
        const totalPrices = vendorMaterial.detail.map(
          (detail) => detail.total_price,
        );
        const avgPrice =
          totalPrices.reduce((sum, price) => sum + price, 0) /
          totalPrices.length;
        vendorMaterial.avg_price = avgPrice;
      });

      const totalPrices = item.vendor_material.flatMap((vendorMaterial) =>
        vendorMaterial.detail.map((detail) => detail.total_price),
      );
      const avgPrice =
        totalPrices.reduce((sum, price) => sum + price, 0) / totalPrices.length;
      item.avg_price = avgPrice;

      if (item.type === 'Finished goods') {
        item.material_cost = 1 * avgPrice;
      } else {
        item.material_cost = item.consumption * avgPrice;
      }

      arrResult.push({
        id: item.id,
        project_detail_id: item.project_detail_id,
        type: item.type,
        name: item.name,
        category: item.category,
        consumption: item.consumption,
        consumption_unit: item.consumption_unit,
        avg_price: item.avg_price,
        material_cost: item.material_cost,
      });
    }

    const totalMaterialCost = arrResult.reduce(
      (total, item) => total + item.material_cost,
      0,
    );
    const totalAll =
      (totalMaterialCost * percentage_of_loss) / 100 + totalMaterialCost;

    return {
      detail: arrResult,
      percentage_of_loss,
      total_item_cost: totalMaterialCost,
      total_material_cost: totalAll,
    };
  }

  async calculateProductionItemCost(listProduction: any[]) {
    if (listProduction.length < 1) {
      return {
        detail: [],
        percentage_of_loss: 0,
        total_cost: 0,
        total_production_cost: 0,
      };
    }

    let totalCostPrice = 0;
    let totalPercentageOfLoss = 0;

    for (const productionItem of listProduction) {
      totalCostPrice += productionItem.sub_total_price;
      totalPercentageOfLoss += productionItem.percentage_of_loss;
    }

    const totalAll =
      (totalCostPrice * totalPercentageOfLoss) / 100 + totalCostPrice;

    return {
      detail: listProduction,
      percentage_of_loss: totalPercentageOfLoss,
      total_cost: totalCostPrice,
      total_production_cost: totalAll,
    };
  }

  async calculateDelivery(listDelivery: any[], sumQuantity: number) {
    if (listDelivery.length < 1) {
      return {
        detail: 0,
        total_delivery_cost: 0,
        total_delivery_cost_all_items: 0,
      };
    }

    let totalDeliveryCost = 0;

    for (const productionItem of listDelivery) {
      totalDeliveryCost += productionItem.shipping_cost;
    }

    const totalDeliveryCostAllItems = totalDeliveryCost * sumQuantity;

    return {
      detail: listDelivery,
      total_delivery_cost: totalDeliveryCost,
      total_delivery_cost_all_items: totalDeliveryCostAllItems,
    };
  }
}
