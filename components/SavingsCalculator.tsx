'use client'

import { useState, useEffect } from 'react'

interface SavingsCalculatorProps {
  currentRate?: number
  newRate?: number
  productName?: string
}

export default function SavingsCalculator({
  currentRate = 37.5,
  newRate = 7.5,
  productName = 'your product'
}: SavingsCalculatorProps) {
  const [unitValue, setUnitValue] = useState(50)
  const [annualVolume, setAnnualVolume] = useState(10000)
  const [animatedSavings, setAnimatedSavings] = useState(0)

  // Calculate savings
  const currentDutyPerUnit = unitValue * (currentRate / 100)
  const newDutyPerUnit = unitValue * (newRate / 100)
  const savingsPerUnit = currentDutyPerUnit - newDutyPerUnit
  const annualSavings = savingsPerUnit * annualVolume
  const fiveYearSavings = annualSavings * 5

  // Animate savings number
  useEffect(() => {
    let start = 0
    const end = annualSavings
    const duration = 800
    const increment = end / (duration / 16)

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setAnimatedSavings(end)
        clearInterval(timer)
      } else {
        setAnimatedSavings(start)
      }
    }, 16)

    return () => clearInterval(timer)
  }, [annualSavings])

  return (
    <div className="card">
      <h3 className="text-2xl font-semibold mb-6" style={{ color: 'var(--color-text)' }}>
        Savings Calculator
      </h3>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>
            Unit Value ($)
          </label>
          <input
            type="number"
            value={unitValue}
            onChange={(e) => setUnitValue(parseFloat(e.target.value) || 0)}
            className="input-field"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>
            Annual Volume (units)
          </label>
          <input
            type="number"
            value={annualVolume}
            onChange={(e) => setAnnualVolume(parseInt(e.target.value) || 0)}
            className="input-field"
            min="0"
            step="1000"
          />
        </div>
      </div>

      {/* Duty Comparison */}
      <div className="grid grid-cols-2 gap-6 mb-8 p-6 rounded-2xl" style={{ backgroundColor: '#f5f5f7' }}>
        <div>
          <p className="text-xs mb-2" style={{ color: 'var(--color-muted)' }}>CURRENT DUTY</p>
          <p className="text-sm mb-1" style={{ color: 'var(--color-muted)' }}>
            {currentRate}% duty rate
          </p>
          <p className="text-3xl font-semibold" style={{ color: 'var(--color-negative)' }}>
            ${currentDutyPerUnit.toFixed(2)}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>per unit</p>
        </div>

        <div>
          <p className="text-xs mb-2" style={{ color: 'var(--color-muted)' }}>NEW DUTY</p>
          <p className="text-sm mb-1" style={{ color: 'var(--color-muted)' }}>
            {newRate}% duty rate
          </p>
          <p className="text-3xl font-semibold" style={{ color: 'var(--color-positive)' }}>
            ${newDutyPerUnit.toFixed(2)}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>per unit</p>
        </div>
      </div>

      {/* Savings Display */}
      <div className="text-center p-8 rounded-2xl mb-6" style={{
        background: 'linear-gradient(to bottom right, #f5f5f7, var(--color-card-bg))'
      }}>
        <p className="text-sm mb-3" style={{ color: 'var(--color-muted)' }}>ANNUAL SAVINGS</p>
        <p className="text-5xl md:text-6xl font-semibold mb-2" style={{
          color: 'var(--color-positive)',
          fontVariantNumeric: 'tabular-nums'
        }}>
          ${animatedSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}
        </p>
        <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
          at {annualVolume.toLocaleString()} units/year
        </p>
      </div>

      {/* Projections Grid */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="stat-label">Per Unit</p>
          <p className="text-xl font-semibold" style={{ color: 'var(--color-positive)' }}>
            ${savingsPerUnit.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="stat-label">Annual</p>
          <p className="text-xl font-semibold" style={{ color: 'var(--color-positive)' }}>
            ${annualSavings.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="stat-label">5-Year</p>
          <p className="text-xl font-semibold" style={{ color: 'var(--color-positive)' }}>
            ${fiveYearSavings.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Context */}
      <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#fff9e6' }}>
        <p className="text-sm" style={{ color: 'var(--color-text)' }}>
          💡 This represents a <strong>{((savingsPerUnit / currentDutyPerUnit) * 100).toFixed(1)}%</strong> reduction in duty costs for {productName}. Over 5 years, that's <strong>${fiveYearSavings.toLocaleString()}</strong> that stays in your business instead of going to tariffs.
        </p>
      </div>
    </div>
  )
}
