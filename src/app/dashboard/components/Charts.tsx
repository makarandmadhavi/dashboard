'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Paper, Typography } from '@mui/material';

export interface LineChartData {
  year: number;
  count: number;
}

interface LineChartProps {
  data: LineChartData[];
  filterYear: number | 'all';
}

export function InteractiveLineChart({ data, filterYear }: LineChartProps) {
  const ref = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Clear previous content
    d3.select(ref.current).selectAll('*').remove();

    const width = 600;
    const height = 400;
    const margin = { top: 40, right: 30, bottom: 50, left: 50 };

    // Filter data
    const filteredData = filterYear !== 'all'
      ? data.filter((d) => d.year === filterYear)
      : data;

    const svg = d3.select(ref.current)
      .attr('width', width)
      .attr('height', height);

    // Create scales
    const x = d3.scaleLinear()
      .domain(d3.extent(filteredData, (d) => d.year) as [number, number])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(filteredData, (d) => d.count) || 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Add X Axis
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x)
        .ticks(filteredData.length)
        .tickFormat(d3.format("d")))
      .selectAll('text')
      .attr('font-size', '10px')
      .attr('fill', 'white');

    // Add Y Axis
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y)
        .ticks(5)
        .tickFormat(d3.format(".2s")))
      .selectAll('text')
      .attr('font-size', '10px')
      .attr('fill', 'white');

    // Axis Labels
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '12px')
      .text('Year');

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(15,${height / 2}) rotate(-90)`)
      .attr('fill', 'white')
      .attr('font-size', '12px')
      .text('Count');

    // Create line generator
    const lineGenerator = d3.line<LineChartData>()
      .x((d) => x(d.year))
      .y((d) => y(d.count));

    // Append the line path
    svg.append('path')
      .datum(filteredData)
      .attr('fill', 'none')
      .attr('stroke', '#14b8a6')
      .attr('stroke-width', 2)
      .attr('d', lineGenerator);

    // Add circles for data points with hover interactions
    svg.selectAll('circle')
      .data(filteredData)
      .enter()
      .append('circle')
      .attr('cx', (d) => x(d.year))
      .attr('cy', (d) => y(d.count))
      .attr('r', 4)
      .attr('fill', '#14b8a6')
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget).transition().duration(100).attr('r', 6);
        if (tooltipRef.current) {
          d3.select(tooltipRef.current)
            .style('opacity', 1)
            .html(`<strong>Year:</strong> ${d.year}<br/><strong>Count:</strong> ${d.count}`)
            .style('left', event.pageX + 10 + 'px')
            .style('top', event.pageY - 28 + 'px');
        }
      })
      .on('mouseout', (event, d) => {
        d3.select(event.currentTarget).transition().duration(100).attr('r', 4);
        if (tooltipRef.current) {
          d3.select(tooltipRef.current).style('opacity', 0);
        }
      });

    // Append tooltip if it doesn't exist
    if (!d3.select('.tooltip-line').node()) {
      d3.select('body')
        .append('div')
        .attr('class', 'tooltip-line absolute bg-gray-900 text-white p-2 rounded text-sm opacity-0 pointer-events-none');
    }
    tooltipRef.current = d3.select('.tooltip-line').node() as HTMLDivElement;

  }, [data, filterYear]);

  return <svg ref={ref}></svg>;
}
interface BarChartData {
  car_model: string;
  count: number;
  total_sales: number;
}

interface BarChartProps {
  data: BarChartData[];
  filterCompany: string | 'all';
}

export function InteractiveBarChart({ data, filterCompany }: BarChartProps) {
    const ref = useRef<SVGSVGElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      d3.select(ref.current).selectAll('*').remove();
  
      const filteredData =
        filterCompany !== 'all'
          ? data.filter((d) => d.car_model === filterCompany)
          : data;
  
      // Increased dimensions for a larger chart
      const width = 600;
      const height = 400;
      const margin = { top: 50, right: 30, bottom: 60, left: 60 };
  
      const svg = d3.select(ref.current)
        .attr('width', width)
        .attr('height', height);
  
      // X scale and axis (but we remove tick labels)
      const x = d3.scaleBand()
        .domain(filteredData.map((d) => d.car_model))
        .range([margin.left, width - margin.right])
        .padding(0.2);
  
      // Option 1: Append axis and then remove tick labels
      const xAxis = svg.append('g')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(x));
      xAxis.selectAll('text').remove(); // Remove tick labels
  
      // Y scale and axis with tick formatting
      const y = d3.scaleLinear()
        .domain([0, d3.max(filteredData, (d) => d.total_sales) || 0])
        .nice()
        .range([height - margin.bottom, margin.top]);
  
      svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).tickFormat(d3.format(".2s")))
        .attr('font-size', '12px')
        .attr('fill', 'white');
  
      // Axis Labels
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', height - 15)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .attr('font-size', '14px')
        .text('Car Model');
  
      svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', `translate(15,${height / 2}) rotate(-90)`)
        .attr('fill', 'white')
        .attr('font-size', '14px')
        .text('Total Sales');
  
      // Draw bars with interactivity
      svg.selectAll('.bar')
        .data(filteredData)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', (d) => x(d.car_model)!)
        .attr('y', (d) => y(d.total_sales))
        .attr('width', x.bandwidth())
        .attr('height', (d) => height - margin.bottom - y(d.total_sales))
        .attr('fill', '#14b8a6')
        .on('mouseover', function(event, d) {
          d3.select(this).attr('fill', '#0d9488');
          if (tooltipRef.current) {
            d3.select(tooltipRef.current)
              .style('opacity', 1)
              .html(`<strong>${d.car_model}</strong><br/><strong>Sales:</strong> ${d.total_sales}`)
              .style('left', event.pageX + 10 + 'px')
              .style('top', event.pageY - 28 + 'px');
          }
        })
        .on('mouseout', function(event, d) {
          d3.select(this).attr('fill', '#14b8a6');
          if (tooltipRef.current) {
            d3.select(tooltipRef.current).style('opacity', 0);
          }
        });
  
      // Append tooltip div if not already present
      if (!d3.select('.tooltip-bar').node()) {
        d3.select('body')
          .append('div')
          .attr('class', 'tooltip-bar absolute bg-gray-900 text-white p-2 rounded text-sm opacity-0 pointer-events-none');
      }
      tooltipRef.current = d3.select('.tooltip-bar').node() as HTMLDivElement;
    }, [data, filterCompany]);
  
    return <svg ref={ref}></svg>;
  }
