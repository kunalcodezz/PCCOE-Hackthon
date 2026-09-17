import React from 'react';
import { Gift, Award, CheckCircle2, Sparkles, ArrowRight, Wallet, ShoppingBag } from 'lucide-react';

interface Props {
  onJoinAsCitizen: () => void;
}

export const RewardsSection: React.FC<Props> = ({ onJoinAsCitizen }) => {
  const steps = [
    { num: '01', title: 'RECYCLE', desc: 'Segregate & log clean household or shop material.' },
    { num: '02', title: 'VERIFY', desc: 'Scan at authorized municipal recovery deposit.' },
    { num: '03', title: 'EARN', desc: 'Receive instant points calibrated to actual weight.' },
    { num: '04', title: 'REDEEM', desc: 'Spend points on municipal credits or eco goods.' },
  ];

  const rewards = [
    {
      title: '₹50 LOCAL REWARD',
      cost: '500 POINTS',
      category: 'Municipal Utility Credit',
      desc: 'Applied directly toward local property taxes or clean transport metro pass.',
      badge: 'POPULAR',
    },
    {
      title: 'ECO MERCHANDISE',
      cost: '1000 POINTS',
      category: 'Physical Goods',
      desc: 'Upcycled heavy-duty canvas tote & double-wall insulated stainless water flask.',
      badge: 'CIRCULAR GOODS',
    },
    {
      title: 'PARTNER DISCOUNT',
      cost: '1500 POINTS',
      category: 'Merchant Voucher',
      desc: 'Flat 25% discount across verified zero-waste organic grocery partners.',
      badge: 'MERCHANT NETWORK',
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#F6F5EF] border-b border-[#D9DDD5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#D9DDD5] gap-6">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#238B57] font-semibold mb-2">
              08 / CIVIC PARTICIPATION
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#12372A] tracking-tight">
              MAKE RECYCLING REWARDING.
            </h2>
          </div>
          <p className="text-base sm:text-lg text-[#32483E] font-medium max-w-md">
            Closing the loop starts with individuals and local communities.
            <span className="block text-sm text-[#556960] mt-1 font-normal">
              Direct civic incentive structures linking verified household drop-offs to community benefits.
            </span>
          </p>
        </div>

        {/* Human and Approachable Circular Score Card + Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          {/* User Score Card Preview */}
          <div className="lg:col-span-4 bg-[#FFFFFF] border-2 border-[#12372A] rounded-sm p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#D9DDD5]">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#238B57]" />
                  <span className="font-mono text-xs font-bold text-[#12372A]">CITIZEN LEDGER ID #4490</span>
                </div>
                <span className="bg-[#E5EFE8] text-[#238B57] font-mono text-[10px] font-bold px-2 py-0.5 rounded-xs">
                  TIER: SILVER CIRCLE
                </span>
              </div>

              <div className="text-xs font-mono text-[#7D9187] uppercase tracking-wider">
                CIRCULAR SCORE
              </div>
              <div className="text-5xl sm:text-6xl font-black text-[#12372A] font-mono tracking-tight mt-1">
                2,450
              </div>
              <div className="text-xs font-mono font-bold text-[#238B57] uppercase tracking-wider mt-1">
                POINTS AVAILABLE
              </div>

              <p className="text-xs text-[#556960] mt-4 leading-relaxed">
                Earned from 48.5 KG of clean plastics and segregated paper submitted across 12 neighborhood collection drives.
              </p>
            </div>

            <div className="pt-6 border-t border-[#D9DDD5] mt-6">
              <button
                type="button"
                onClick={onJoinAsCitizen}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#12372A] hover:bg-[#238B57] text-[#F6F5EF] font-mono text-xs font-bold rounded-xs transition-colors cursor-pointer"
              >
                <span>LOG CITIZEN DROP-OFF</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Sequential 4-Step Process: Recycle -> Verify -> Earn -> Redeem */}
          <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#D9DDD5] rounded-sm p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div className="text-xs font-mono font-bold text-[#12372A] uppercase tracking-wider pb-3 border-b border-[#D9DDD5] mb-6">
              THE 4-STEP CIVIC INCENTIVE LOOP
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {steps.map((step, idx) => (
                <div key={step.title} className="p-4 bg-[#F6F5EF] border border-[#D9DDD5] rounded-xs flex flex-col justify-between">
                  <div>
                    <div className="font-mono text-xs font-bold text-[#238B57] mb-2">
                      [{step.num}]
                    </div>
                    <div className="font-bold text-[#12372A] text-sm mb-1 font-mono">
                      {step.title}
                    </div>
                    <div className="text-xs text-[#556960] leading-relaxed">
                      {step.desc}
                    </div>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="hidden lg:block text-[#7D9187] text-right font-mono text-xs mt-2">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-[#D9DDD5] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#556960]">
              <span className="flex items-center gap-1.5 text-[#238B57] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Zero transaction fees • Instant blockchain-linked loyalty credits
              </span>
              <span>Pune Municipal Corporation Approved Pilot</span>
            </div>
          </div>
        </div>

        {/* 3 Real Rewards Showcases */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rewards.map((reward) => (
            <div
              key={reward.title}
              className="bg-[#FFFFFF] border border-[#D9DDD5] hover:border-[#238B57] p-6 rounded-sm shadow-2xs transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#D9DDD5] font-mono text-[11px]">
                  <span className="text-[#7D9187] uppercase">{reward.category}</span>
                  <span className="bg-[#E5EFE8] text-[#12372A] px-2 py-0.5 rounded-xs font-bold text-[10px]">
                    {reward.badge}
                  </span>
                </div>

                <h4 className="text-xl font-extrabold text-[#12372A] mb-1">
                  {reward.title}
                </h4>
                <div className="text-sm font-mono font-bold text-[#238B57] mb-3">
                  {reward.cost}
                </div>

                <p className="text-xs text-[#556960] leading-relaxed">
                  {reward.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#D9DDD5] flex items-center justify-between text-xs font-mono text-[#12372A] font-bold group-hover:text-[#238B57] transition-colors">
                <span>REDEEM REWARD</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
