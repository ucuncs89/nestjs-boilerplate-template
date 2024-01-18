import { Injectable } from '@nestjs/common';
import { ProjectVendorProductionEntity } from 'src/entities/project/project_vendor_production.entity';
import { ProjectShippingEntity } from 'src/entities/project/project_shipping.entity';
import { ProjectAdditionalCostEntity } from 'src/entities/project/project_additional_cost.entity';
import { ProjectSamplingEntity } from 'src/entities/project/project_sampling.entity';
import { ProjectPriceEntity } from 'src/entities/project/project_price.entity';

interface RecapResult {
  detail: any[];
  total_cost: number;
}

@Injectable()
export class ProjectCostingRecapService {
  async calculateRecap(
    listFabricItem?: any[],
    listSewingItem?: any[],
    listPackagingItem?: any[],
    listFinishedGoodsItem?: any[],
    listProduction?: ProjectVendorProductionEntity[],
    listShipping?: ProjectShippingEntity[],
    listAdditionalCost?: ProjectAdditionalCostEntity[],
    listSampling?: ProjectSamplingEntity[],
    price?: ProjectPriceEntity,
  ): Promise<any> {
    const fabric = await this.calculateMaterialRecap(listFabricItem);
    const sewing = await this.calculateMaterialRecap(listSewingItem);
    const packaging = await this.calculateMaterialRecap(listPackagingItem);
    const finishedGoods = await this.calculateMaterialRecap(
      listFinishedGoodsItem,
    );
    const production = await this.calculateProductionRecap(listProduction);
    const shipping = await this.calculateShipping(listShipping);
    const additionalCost = await this.calculateAdditional(listAdditionalCost);
    const sampling = await this.calculateSampling(listSampling);

    const cogs_total_cost =
      fabric.total_cost +
      sewing.total_cost +
      packaging.total_cost +
      finishedGoods.total_cost +
      production.total_cost +
      shipping.total_cost +
      sampling.total_cost;

    const cost_of_good_sold = {
      fabric_cost: fabric.total_cost,
      sewing_cost: sewing.total_cost,
      packaging_cost: packaging.total_cost,
      finished_goods_cost: finishedGoods.total_cost,
      production_cost: production.total_cost,
      shipping_cost: shipping.total_cost,
      sampling_cost: sampling.total_cost,
      total_cost: cogs_total_cost,
    };

    let profit_unit = {};
    if (price !== null) {
      const totalCOGS =
        (price.loss_percentage / 100) * cost_of_good_sold.total_cost +
        cost_of_good_sold.total_cost;

      const profit_loss_unit =
        price.selling_price_per_item -
        totalCOGS -
        additionalCost.total_cost -
        (price.commission / 100) * price.selling_price_per_item;

      profit_unit = {
        cost_of_good_sold: cost_of_good_sold.total_cost,
        loss_percentage: price.loss_percentage,
        total_cost_of_good_sold: totalCOGS,
        additional_cost: additionalCost.total_cost,
        commission: price.commission,
        selling_price: price.selling_price_per_item,
        profit_loss_unit,
      };
    }

    return {
      fabric,
      sewing,
      packaging,
      finishedGoods,
      production,
      shipping,
      cost_of_good_sold,
      additional_cost: additionalCost,
      sampling,
      profit_unit,
    };
  }

  async calculateMaterialRecap(listMaterialItem: any[]): Promise<RecapResult> {
    if (listMaterialItem.length < 1) {
      return { detail: [], total_cost: 0 };
    }

    const detail = listMaterialItem.map((item) => {
      const allowPercent = item.allowance / 100;
      const allowPrice = allowPercent * item.consumption + item.consumption;
      const material_cost = item.avg_price * allowPrice;

      return {
        ...item,
        allowPercent,
        allowPrice,
        material_cost,
      };
    });

    const total_cost = detail.reduce(
      (total, item) => total + item.material_cost,
      0,
    );

    return { detail, total_cost };
  }

  async calculateProductionRecap(
    listProduction: ProjectVendorProductionEntity[],
  ): Promise<RecapResult> {
    if (listProduction.length < 1) {
      return { detail: [], total_cost: 0 };
    }

    const detail = listProduction.map((item) => {
      const average =
        item.total_quantity !== null && item.total_quantity !== 0
          ? item.sub_total_price / item.total_quantity
          : 0;

      return { ...item, average };
    });

    const total_cost = detail.reduce((total, item) => total + item.average, 0);

    return { detail, total_cost };
  }

  async calculateShipping(
    listShipping: ProjectShippingEntity[],
  ): Promise<RecapResult> {
    if (listShipping.length < 1) {
      return { detail: listShipping, total_cost: 0 };
    }

    const total_cost = listShipping.reduce(
      (total, item) => total + item.shipping_cost,
      0,
    );

    return { detail: listShipping, total_cost };
  }

  async calculateAdditional(
    listAdditionalCost: ProjectAdditionalCostEntity[],
  ): Promise<RecapResult> {
    if (listAdditionalCost.length < 1) {
      return { detail: listAdditionalCost, total_cost: 0 };
    }

    const total_cost = listAdditionalCost.reduce(
      (total, item) => total + item.additional_price,
      0,
    );

    return { detail: listAdditionalCost, total_cost };
  }

  async calculateSampling(
    listSampling: ProjectSamplingEntity[],
  ): Promise<RecapResult> {
    if (listSampling.length < 1) {
      return { detail: listSampling, total_cost: 0 };
    }

    const total_cost = listSampling.reduce(
      (total, item) => total + item.cost,
      0,
    );

    return { detail: listSampling, total_cost };
  }
}
