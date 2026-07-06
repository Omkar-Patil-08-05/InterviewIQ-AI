"use client"

import { motion } from "framer-motion"

const companies = [
  { name: "Amazon", color: "hover:text-[#FF9900]" },
  { name: "Google", color: "hover:text-[#4285F4]" },
  { name: "Microsoft", color: "hover:text-[#00A4EF]" },
  { name: "Meta", color: "hover:text-[#0668E1]" },
  { name: "Apple", color: "hover:text-gray-300" },
  { name: "Netflix", color: "hover:text-[#E50914]" },
  { name: "Flipkart", color: "hover:text-[#2874F0]" },
  { name: "Infosys", color: "hover:text-[#007CC3]" },
  { name: "TCS", color: "hover:text-[#3B72BA]" },
  { name: "Wipro", color: "hover:text-[#FF0000]" },
  { name: "Accenture", color: "hover:text-[#A100FF]" },
  { name: "Adobe", color: "hover:text-[#FF0000]" }
]

export function CompanySupport() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      <div className="text-center mb-12">
        <h2 className="text-sm font-semibold tracking-widest text-muted-foreground uppercase mb-8">
          Practice for top tier companies
        </h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-8">
        {companies.map((company, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className={`flex items-center justify-center h-20 rounded-xl bg-white/[0.02] border border-white/5 text-gray-500 font-bold text-xl md:text-2xl transition-all duration-300 cursor-default ${company.color} hover:bg-white/5 hover:border-white/10 hover:shadow-lg`}
          >
            {company.name}
          </motion.div>
        ))}
      </div>
    </section>
  )
}
