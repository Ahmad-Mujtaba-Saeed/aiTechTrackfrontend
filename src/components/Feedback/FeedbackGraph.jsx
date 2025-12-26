import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { merge } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { percent } from 'framer-motion';
import { FaPercentage } from 'react-icons/fa';

const ChartComponent = ({parsedFeedback}) => {

  const Percentage = (achieved, total) => {
    if (!total) return 0;
    if (achieved == 0) return 0;
    return Math.round((achieved / total) * 100);
  }
  const navigate = useNavigate();
  const gaugeRef = useRef(null);
  const radarCustomizedRef = useRef(null);
  const radarFourLabelsRef = useRef(null);
  const radarCommunicationRef = useRef(null);
  const [chartsInitialized, setChartsInitialized] = useState(false);

  // Mock phoenix utils since we don't have the actual package
  const phoenixUtils = {
    breakpoints: { xs: 576, sm: 768, md: 992, lg: 1200, xl: 1540 },
    getData: (el, key) => ({}), // Mock function
    resize: (callback) => {
      window.addEventListener('resize', callback);
    },
    docReady: (callback) => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
      } else {
        callback();
      }
    }
  };

  // Ensure container has a usable height
  const ensureChartBox = (el, minHeight) => {
    if (!el) return;
    const h = el.clientHeight;
    if (!h || h < 10) {
      el.style.minHeight = `${minHeight || 350}px`;
    }
  };

  // For square charts (height follows width)
  const keepSquare = (el, minPx) => {
    const sync = () => {
      const w = el.clientWidth || 0;
      if (!w) return;
      el.style.height = `${Math.max(w, minPx || 120)}px`;
    };
    
    sync();
    
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => {
        sync();
      });
      ro.observe(el);
    }
    window.addEventListener('resize', sync);
  };

  // Phoenix helper: set options + handle responsive + resize hooks
  const echartSetOption = (chart, dataset, getOption, responsiveOptions) => {
    const handleResizeOptions = (options) => {
      Object.keys(options).forEach((bp) => {
        if (window.innerWidth > phoenixUtils.breakpoints[bp]) {
          chart.setOption(options[bp]);
        }
      });
    };

    chart.setOption(merge(getOption(), dataset));

    const navToggle = document.querySelector('.navbar-vertical-toggle');
    if (navToggle) {
      navToggle.addEventListener('navbar.vertical.toggle', () => {
        chart.resize();
        if (responsiveOptions) handleResizeOptions(responsiveOptions);
      });
    }

    phoenixUtils.resize(() => {
      chart.resize();
      if (responsiveOptions) handleResizeOptions(responsiveOptions);
    });

    if (responsiveOptions) handleResizeOptions(responsiveOptions);

    document.body.addEventListener('clickControl', (ev) => {
      const control = ev.detail?.control;
      if (control === 'phoenixTheme') {
        chart.setOption(merge(getOption(), dataset));
        if (responsiveOptions) handleResizeOptions(responsiveOptions);
      }
    });
  };

  // Label-aware radar autosizer
  const observeRadar = (el, chart, labels, options = {}) => {
    const fontSize = options.fontSize || 10;
    const sidePad = options.sidePad || 8;
    const minRadius = options.minRadius || 40;
    const maxRadiusPct = options.maxRadiusPct || 0.75;

    const computeRadius = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx.font = `${fontSize}px sans-serif`;

      let maxTextWidth = 0;
      labels.forEach((label) => {
        const w = ctx.measureText(label).width;
        if (w > maxTextWidth) maxTextWidth = w;
      });

      const cw = el.clientWidth || 0;
      const ch = el.clientHeight || 0;
      if (cw === 0 || ch === 0) return minRadius;

      const maxRadius = (Math.min(cw, ch) / 2) * maxRadiusPct;
      const radius = Math.max(minRadius, maxRadius - maxTextWidth / 2 - sidePad);
      return Math.floor(radius);
    };

    const relayout = () => {
      const r = computeRadius();
      chart.setOption({ radar: [{ radius: r }] }, false);
      chart.resize();
    };

    relayout();

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => {
        relayout();
      });
      ro.observe(el);
    }

    window.addEventListener('resize', relayout);
  };

  // Competences Chart (6-label)
  const radarCustomizedChartInit = () => {
    const el = radarCustomizedRef.current;
    if (!el) return;

    ensureChartBox(el, 350);

    const labels = [
      'Critical Thinking',
      'Teamwork Balance',
      'Goal Orientation',
      'Emotional Intelligence',
      'Structural Coherence',
      'Question Relevance'
    ];

    const tooltipFormatter = (params) => {
      const vals = params.value || [];
      let rows = '';
      labels.forEach((label, i) => {
        rows += `<strong>${label}</strong>: ${vals[i]}%<br>`;
      });
      return `<strong>${params.name}</strong><div class="fs-9 text-body-tertiary">${rows}</div>`;
    };

    const dataset = phoenixUtils.getData(el, 'echarts');
    const chart = echarts.init(el);

    echartSetOption(chart, dataset, () => ({
      legend: { show: false },
      tooltip: {
        trigger: 'item',
        padding: [7, 10],
        backgroundColor: '#f8f9fa',
        borderColor: '#dee2e6',
        textStyle: { color: '#212529' },
        borderWidth: 1,
        transitionDuration: 0,
        axisPointer: { type: 'none' },
        formatter: tooltipFormatter,
        confine: true
      },
      radar: [
        {
          indicator: labels.map((name) => ({ name, max: 100 })),
          radius: 90,
          center: ['50%', '50%'],
          splitLine: { lineStyle: { color: '#6c757d' } },
          name: {
            textStyle: {
              color: '#6c757d',
              backgroundColor: '#f8f9fa',
              borderRadius: 3,
              padding: [3, 5],
              fontSize: 10
            }
          }
        }
      ],
      series: [
        {
          type: 'radar',
          data: [
            {
              value: [Percentage(parsedFeedback?.evaluation?.breakdown?.competencies?.critical_thinking?.score,8), Percentage(parsedFeedback?.evaluation?.breakdown?.competencies?.teamwork_balance?.score,5), Percentage(parsedFeedback?.evaluation?.breakdown?.competencies?.goal_orientation?.score, 5), Percentage(parsedFeedback?.evaluation?.breakdown?.competencies?.emotional_intelligence?.score,6), Percentage(parsedFeedback?.evaluation?.breakdown?.competencies?.structural_coherence?.score,3), Percentage(parsedFeedback?.evaluation?.breakdown?.competencies?.question_relevance?.score,3)],
              name: 'Assessment',
              symbol: 'rect',
              symbolSize: 10,
              lineStyle: { type: 'dashed' },
              itemStyle: { color: '#BA67EF' },
              areaStyle: { color: 'rgba(186,103,239,0.3)' },
              label: {
                show: true,
                formatter: (p) => `${p.value}%`,
                color: '#6c757d',
                fontSize: 10
              }
            }
          ]
        }
      ]
    }));

    observeRadar(el, chart, labels, {
      fontSize: 10,
      sidePad: 8,
      minRadius: 40,
      maxRadiusPct: 0.75
    });

    setTimeout(() => chart.resize(), 0);
  };

  // STAR Chart (4-label)
  const radarFourLabelsChartInit = () => {
    const el = radarFourLabelsRef.current;
    if (!el) return;

    ensureChartBox(el, 350);

    const labels = ['Situation', 'Task', 'Action', 'Result'];

    const tooltipFormatter = (params) => {
      const vals = params.value || [];
      let rows = '';
      labels.forEach((label, i) => {
        rows += `<strong>${label}</strong>: ${vals[i]}%<br>`;
      });
      return `<strong>${params.name}</strong><div class="fs-9 text-body-tertiary">${rows}</div>`;
    };

    const dataset = phoenixUtils.getData(el, 'echarts');
    const chart = echarts.init(el);

    echartSetOption(chart, dataset, () => ({
      legend: { show: false },
      tooltip: {
        trigger: 'item',
        padding: [7, 10],
        backgroundColor: '#f8f9fa',
        borderColor: '#dee2e6',
        textStyle: { color: '#212529' },
        borderWidth: 1,
        transitionDuration: 0,
        axisPointer: { type: 'none' },
        formatter: tooltipFormatter,
        confine: true
      },
      radar: [
        {
          indicator: labels.map((name) => ({ name, max: 100 })),
          radius: 90,
          center: ['50%', '50%'],
          splitLine: { lineStyle: { color: '#6c757d' } },
          name: {
            textStyle: {
              color: '#6c757d',
              backgroundColor: '#f8f9fa',
              borderRadius: 3,
              padding: [3, 5],
              fontSize: 10
            }
          }
        }
      ],
      series: [
        {
          type: 'radar',
          data: [
            {
              value: [Percentage(parsedFeedback?.evaluation?.breakdown?.star_method?.situation?.score,10), Percentage(parsedFeedback?.evaluation?.breakdown?.star_method?.task?.score,10), Percentage(parsedFeedback?.evaluation?.breakdown?.star_method?.action?.score,20), Percentage(parsedFeedback?.evaluation?.breakdown?.star_method?.result?.score,10)],
              name: 'STAR Assessment',
              symbol: 'rect',
              symbolSize: 10,
              lineStyle: { type: 'dashed' },
              itemStyle: { color: '#BA67EF' },
              areaStyle: { color: 'rgba(186,103,239,0.3)' },
              label: {
                show: true,
                formatter: (p) => `${p.value}%`,
                color: '#6c757d',
                fontSize: 10
              }
            }
          ]
        }
      ]
    }));

    observeRadar(el, chart, labels, {
      fontSize: 10,
      sidePad: 8,
      minRadius: 40,
      maxRadiusPct: 0.75
    });

    setTimeout(() => chart.resize(), 0);
  };

  // Communication Chart (4-label)
  const radarCommunicationChartInit = () => {
    const el = radarCommunicationRef.current;
    if (!el) return;

    ensureChartBox(el, 350);

    const labels = ['Clarity', 'Professional', 'Confidence', 'Filler'];

    const tooltipFormatter = (params) => {
      const vals = params.value || [];
      let rows = '';
      labels.forEach((label, i) => {
        rows += `<strong>${label}</strong>: ${vals[i]}%<br>`;
      });
      return `<strong>${params.name}</strong><div class="fs-9 text-body-tertiary">${rows}</div>`;
    };

    const dataset = phoenixUtils.getData(el, 'echarts');
    const chart = echarts.init(el);

    echartSetOption(chart, dataset, () => ({
      legend: { show: false },
      tooltip: {
        trigger: 'item',
        padding: [7, 10],
        backgroundColor: '#f8f9fa',
        borderColor: '#dee2e6',
        textStyle: { color: '#212529' },
        borderWidth: 1,
        transitionDuration: 0,
        axisPointer: { type: 'none' },
        formatter: tooltipFormatter,
        confine: true
      },
      radar: [
        {
          indicator: labels.map((name) => ({ name, max: 100 })),
          radius: 90,
          center: ['50%', '50%'],
          splitLine: { lineStyle: { color: '#6c757d' } },
          name: {
            textStyle: {
              color: '#6c757d',
              backgroundColor: '#f8f9fa',
              borderRadius: 3,
              padding: [3, 5],
              fontSize: 10
            }
          }
        }
      ],
      series: [
        {
          type: 'radar',
          data: [
            {
              value: [Percentage(parsedFeedback?.evaluation?.breakdown?.communication?.clarity?.score,8), Percentage(parsedFeedback?.evaluation?.breakdown?.communication?.professional_language?.score,4), Percentage(parsedFeedback?.evaluation?.breakdown?.communication?.confidence?.score,4), Percentage(parsedFeedback?.evaluation?.breakdown?.communication?.filler_words?.score,4)],
              name: 'Communication Assessment',
              symbol: 'rect',
              symbolSize: 10,
              lineStyle: { type: 'dashed' },
              itemStyle: { color: '#BA67EF' },
              areaStyle: { color: 'rgba(186,103,239,0.3)' },
              label: {
                show: true,
                formatter: (p) => `${p.value}%`,
                color: '#6c757d',
                fontSize: 10
              }
            }
          ]
        }
      ]
    }));

    observeRadar(el, chart, labels, {
      fontSize: 10,
      sidePad: 8,
      minRadius: 40,
      maxRadiusPct: 0.75
    });

    setTimeout(() => chart.resize(), 0);
  };

  // Competency Gauge
  const competencyGaugeChartInit = () => {
    const el = gaugeRef.current;
    if (!el) return;

    keepSquare(el, 120);

    const dataset = phoenixUtils.getData(el, 'echarts');
    const chart = echarts.init(el);

    const primary = '#BA67EF';
    const track = '#e9ecef';

    echartSetOption(chart, dataset, () => ({
      tooltip: {
        trigger: 'item',
        formatter: () => 'Competent : 67%',
        confine: true
      },
      series: [
        {
          type: 'gauge',
          startAngle: 90,
          endAngle: -270,
          radius: '86%',
          pointer: { show: false },
          progress: {
            show: true,
            overlap: false,
            roundCap: true,
            clip: false,
            itemStyle: { color: primary }
          },
          axisLine: {
            lineStyle: {
              width: 14,
              color: [[1, track]]
            }
          },
          splitLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },
          anchor: { show: false },
          title: {
            show: true,
            offsetCenter: [0, '-8%'],
            fontSize: 13,
            color: primary
          },
          detail: {
            show: true,
            valueAnimation: true,
            offsetCenter: [0, '12%'],
            formatter: '{value}%',
            fontSize: 18,
            lineHeight: 18,
            color: primary
          },
          data: [{ value: 0, name: 'Competent' }],
          animationDuration: 600,
          animationDurationUpdate: 1200
        }
      ]
    }));

    setTimeout(() => {
      chart.setOption({
        series: [{ data: [{ value: parsedFeedback?.evaluation?.breakdown?.total?.score ?? 0, name: 'Competent' }] }]
      });
    }, 200);

    setTimeout(() => chart.resize(), 0);
  };

  useEffect(() => {
    // Initialize all charts
    const initCharts = () => {
      try {
        radarCustomizedChartInit();
        radarFourLabelsChartInit();
        radarCommunicationChartInit();
        competencyGaugeChartInit();
        setChartsInitialized(true);
      } catch (error) {
        console.error('Error initializing charts:', error);
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initCharts, 100);

    return () => {
      clearTimeout(timer);
      // Clean up charts
      [gaugeRef, radarCustomizedRef, radarFourLabelsRef, radarCommunicationRef].forEach(ref => {
        if (ref.current) {
          const chart = echarts.getInstanceByDom(ref.current);
          if (chart) {
            chart.dispose();
          }
        }
      });
    };
  }, []);

  return (
    <div className="row g-2 align-items-stretch">
      <div className="col-12 col-xl-2">
        <div className="card h-100">
          <div className="card-header py-3">
            <h5 className="text-center">Overall Score</h5>
          </div>
          <div className="card-body pt-2">
            <div ref={gaugeRef} className="echart-gauge-competency" style={{ minHeight: '200px' }}></div>
            <button onClick={() => navigate('/prepration/' + parsedFeedback?.question?.id)} className="stretched-link btn btn-primary w-100 mt-3">
              Retry Question
            </button>
          </div>
        </div>
      </div>
      <div className="col-12 col-xl-10">
        <div className="row g-2 align-items-stretch h-100">
          <div className="col-12 col-xl-4">
            <div className="card h-100">
              <div ref={radarCustomizedRef} className="echart-radar-customized-chart-example" style={{ minHeight: '420px' }}></div>
            </div>
          </div>
          <div className="col-12 col-xl-4">
            <div className="px-0 card h-100">
              <div ref={radarFourLabelsRef} className="echart-radar-four-labels" style={{ minHeight: '420px' }}></div>
            </div>
          </div>
          <div className="col-12 col-xl-4">
            <div className="px-0 card h-100">
              <div ref={radarCommunicationRef} className="echart-radar-communication" style={{ minHeight: '420px' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;