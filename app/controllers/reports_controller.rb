class ReportsController < ApplicationController
  
  def update
    admin = User.find current_chapter.user_id
    report = admin.reports.last
    report.increase_downloads
  end
  
end