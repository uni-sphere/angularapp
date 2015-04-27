class ReportsController < ApplicationController
  
  def update
    report = current_node.reports.last
    report.increase_downloads
  end
  
  def index
    first_chart = []
    
    current_node.reports.each do |report|
      first_chart << {week: report.created_at.strftime('%Y-%m-%d'), downloads: report.downloads}
    end
    
    render json: first_chart.to_json, status: 200
  end
  
end