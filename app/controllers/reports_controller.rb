class ReportsController < ApplicationController
  
  def update
    report = current_node.reports.last
    report.increase_downloads
  end
  
  def first_chart
    @firstchart = []
    @reports = current_node.reports
    @first_report = @reports.first.created_at
    @date = @reports.last.created_at - 6.months + 7.days
    @i = 0
    for i in 1..28
      if i > 28 - @reports.count
        report = @reports[@i]
        @firstchart << {date: (@date).strftime('%Y-%m-%d'), downloads: report.downloads}
        clear_logs @date.strftime('%Y-%m-%d')
        clear_logs report.created_at.strftime('%Y-%m-%d')
        @i += 1
      else
        @firstchart << {date: (@date).strftime('%Y-%m-%d'), downloads: 0}
      end
      @date = @date + 7.days
    end

    render json: @firstchart.to_json, status: 200
  end
  
  def second_chart
    @secondchart = []
    
    organization = current_organization
    @date = current_organization.created_at
    
    # first days of creation: set 0 downloads
    @secondchart << {date: @date.strftime('%Y-%m-%d'), lecturers: 1, uploads: 0, downloads: 0}
    
    @lecturers = 0
    
    while (@date - DateTime.now).abs > 7.days
      lecturers = organization.users.where("created_at >= ? AND created_at <= ?", @date-7.days, @date)
      @lecturers += lecturers.count if lecturers
      
      #downloads
      @downloads = 0
      organization.nodes.each do |node|
        report = node.reports.where("created_at >= ? AND created_at <= ?", @date-7.days, @date).first
        @downloads += report.downloads if report
      end
      
      #uploads
      uploads = 0
      awsdocuments = organization.awsdocuments.where("created_at >= ? AND created_at <= ?",  @date-7.days, @date)
      uploads = awsdocuments.count if awsdocuments
      
      # reports created at begining of  the week but shows the data of the whole week
      @date = @date + 7.days

      @secondchart << {date: @date.strftime('%Y-%m-%d'), lecturers: @lecturers, uploads: uploads, downloads: @downloads}
      
    end
    
    render json: @secondchart.to_json, status: 200
  end
  
  def nodes
    render json: user_nodes, status: 200
  end
  
end