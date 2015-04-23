class ReportsController < ApplicationController
  
  def update
    report = current_admin.reports.last
    report.increase_downloads
  end
  
end