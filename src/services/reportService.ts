
import { WasteListing, WasteLifecycleEvent } from '../types';

export interface ESGReportData {
  organizationName: string;
  reportingPeriod: string;
  generatedDate: string;
  reportId: string;
  totalWasteKg: number;
  divertedWasteKg: number;
  recycledWasteKg: number;
  landfillDiversionRate: number;
  verifiedTransactionsCount: number;
  activePartnersCount: number;
  categoryBreakdown: { category: string; quantityKg: number; percentage: number }[];
  traceabilityAuditSummary: {
    wasteId: string;
    material: string;
    quantityKg: number;
    finalStatus: string;
    verificationHash: string;
    date: string;
  }[];
}

export function generateESGReportData(
  listings: WasteListing[],
  events: WasteLifecycleEvent[],
  orgName = 'ABC Industrial Corp'
): ESGReportData {
  let totalWasteKg = 0;
  let divertedWasteKg = 0;
  let recycledWasteKg = 0;

  const categoryMap: Record<string, number> = {};

  const auditSummary: ESGReportData['traceabilityAuditSummary'] = [];

  for (const l of listings) {
    const kg = l.unit === 'Tons' ? l.quantity * 1000 : l.quantity;
    totalWasteKg += kg;
    categoryMap[l.category] = (categoryMap[l.category] || 0) + kg;

    if (l.status === 'RECYCLED' || l.status === 'REUSED') {
      recycledWasteKg += kg;
      divertedWasteKg += kg;
    } else if (
      l.status === 'COLLECTED' ||
      l.status === 'TRANSPORTED' ||
      l.status === 'RECEIVED' ||
      l.status === 'PROCESSED'
    ) {
      divertedWasteKg += kg;
    }

    auditSummary.push({
      wasteId: l.wasteId,
      material: l.material,
      quantityKg: kg,
      finalStatus: l.status,
      verificationHash: l.verificationHash,
      date: new Date(l.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    });
  }

  const categoryBreakdown = Object.entries(categoryMap).map(([category, quantityKg]) => ({
    category,
    quantityKg,
    percentage: totalWasteKg > 0 ? Math.round((quantityKg / totalWasteKg) * 100) : 0,
  }));

  const diversionRate =
    totalWasteKg > 0 ? Math.round((divertedWasteKg / totalWasteKg) * 100) : 0;

  return {
    organizationName: orgName,
    reportingPeriod: 'Q3 2026 (July - September)',
    generatedDate: new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    reportId: `ESG-${Date.now().toString().slice(-6)}`,
    totalWasteKg,
    divertedWasteKg,
    recycledWasteKg,
    landfillDiversionRate: diversionRate,
    verifiedTransactionsCount: events.length,
    activePartnersCount: 5,
    categoryBreakdown,
    traceabilityAuditSummary: auditSummary,
  };
}

export function printESGReport(data: ESGReportData) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    window.print();
    return;
  }

  const categoryRows = data.categoryBreakdown
    .map(
      (c) => `
      <tr>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0;">${c.category}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; text-align: right;">${c.quantityKg.toLocaleString()} KG</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; text-align: right;">${c.percentage}%</td>
      </tr>`
    )
    .join('');

  const auditRows = data.traceabilityAuditSummary
    .map(
      (a) => `
      <tr>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-family: monospace; font-size: 11px;">${a.wasteId}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0;">${a.material}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; text-align: right;">${a.quantityKg} KG</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0;"><span style="background: #ecfdf5; color: #065f46; padding: 2px 6px; border-radius: 4px; font-size: 11px;">${a.finalStatus}</span></td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-family: monospace; font-size: 10px; color: #64748b;">${a.verificationHash.slice(0, 18)}...</td>
      </tr>`
    )
    .join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Prototype ESG Report - ${data.organizationName}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; margin: 40px; }
          .header { border-bottom: 2px solid #059669; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; }
          .disclaimer { background: #fef3c7; border: 1px solid #f59e0b; color: #92400e; padding: 12px; border-radius: 6px; font-size: 12px; margin-bottom: 24px; }
          .metrics { display: flex; gap: 16px; margin-bottom: 24px; }
          .metric-card { flex: 1; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; background: #f8fafc; }
          .metric-val { font-size: 24px; font-weight: bold; color: #059669; }
          .metric-lbl { font-size: 12px; color: #64748b; margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
          th { background: #f1f5f9; text-align: left; padding: 10px 12px; border-bottom: 2px solid #cbd5e1; font-size: 11px; text-transform: uppercase; color: #475569; }
          h2 { font-size: 16px; margin-top: 32px; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 style="margin: 0; font-size: 22px; color: #065f46;">CircuTrace Enterprise ESG Summary</h1>
            <p style="margin: 4px 0 0 0; color: #64748b; font-size: 14px;">Organization: <strong>${data.organizationName}</strong> | Period: ${data.reportingPeriod}</p>
          </div>
          <div style="text-align: right;">
            <p style="margin: 0; font-size: 12px; color: #64748b;">Report ID: <strong>${data.reportId}</strong></p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748b;">Date: ${data.generatedDate}</p>
          </div>
        </div>

        <div class="disclaimer">
          <strong>Notice: Prototype ESG / CSR Report.</strong> All figures represent prototype platform logs and cryptographic event hashes recorded in the demo sandbox. Regulatory certification or carbon offset claims require accredited third-party lifecycle auditor sign-off.
        </div>

        <div class="metrics">
          <div class="metric-card">
            <div class="metric-val">${(data.totalWasteKg / 1000).toFixed(2)} T</div>
            <div class="metric-lbl">Total Waste Registered</div>
          </div>
          <div class="metric-card">
            <div class="metric-val">${(data.divertedWasteKg / 1000).toFixed(2)} T</div>
            <div class="metric-lbl">Diverted from Landfills</div>
          </div>
          <div class="metric-card">
            <div class="metric-val">${data.landfillDiversionRate}%</div>
            <div class="metric-lbl">Diversion Rate</div>
          </div>
          <div class="metric-card">
            <div class="metric-val">${data.verifiedTransactionsCount}</div>
            <div class="metric-lbl">Cryptographic Milestones</div>
          </div>
        </div>

        <h2>1. Material Category Diversion</h2>
        <table>
          <thead>
            <tr><th>Category</th><th style="text-align: right;">Volume</th><th style="text-align: right;">Share</th></tr>
          </thead>
          <tbody>
            ${categoryRows}
          </tbody>
        </table>

        <h2>2. Cryptographic Traceability Audit Log</h2>
        <table>
          <thead>
            <tr><th>Waste ID</th><th>Material</th><th style="text-align: right;">Net Qty</th><th>Terminal Status</th><th>Ledger Hash</th></tr>
          </thead>
          <tbody>
            ${auditRows}
          </tbody>
        </table>

        <div style="margin-top: 40px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 12px;">
          Generated by CircuTrace — From Waste to Value (Transparent. Traceable. Sustainable.)
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 250);
}
