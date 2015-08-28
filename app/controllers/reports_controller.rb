class ReportsController < ApplicationController

  before_action :current_subdomain
  before_action :current_organization
  before_action :current_node, only: [:first_chart, :current_node]

  def update
    report = @current_node.reports.last
    report.increase_downloads
  end

  def first_chart
    if @current_subdomain == 'sandbox'
      firstchart = []
      date = Time.now - 6.months
      t = 0
      for i in 1..28
        firstchart << {date: (date).strftime('%Y-%m-%d'), downloads: rand(10..30)}
        date = date + 7.days
      end
      render json: firstchart.to_json, status: 200
    else
      if !@current_node.reports.last.nil?
        firstchart = []
        reports = @current_node.reports
        date = reports.last.created_at - 6.months
        t = 0
        for i in 1..28
          if i > 28 - reports.count
            report = reports[t]
            firstchart << {date: (report.created_at).strftime('%Y-%m-%d'), downloads: report.downloads}
            t += 1
          else
            firstchart << {date: (date).strftime('%Y-%m-%d'), downloads: 0}
          end
          date = date + 7.days
        end
        render json: firstchart.to_json, status: 200
      else
        render json: {empty: true}.to_json, status: 200
      end
    end
  end

  def second_chart
    secondchart = []

    organization = @current_organization

    date = @current_organization.created_at

    # first days of creation: set 0 downloads
    secondchart << {date: date.strftime('%Y-%m-%d'), lecturers: 1, uploads: 0, downloads: 0}
    lecturers = 0

    if @current_subdomain == 'sandbox'
      while (date - Time.now).abs > 7.days
        secondchart << {date: date.strftime('%Y-%m-%d'), lecturers: rand(2..5), uploads: rand(5..30), downloads: rand(20..70)}
        date = date + 7.days
      end
    else
      while (date - Time.now).abs > 7.days
        lecturers = organization.users.where(created_at: date-7.days..date)

        #downloads
        downloads = 0
        organization.nodes.each do |node|
          report = node.reports.where("created_at >= ? AND created_at <= ?", date-7.days, date).first
          downloads = report.downloads if report
        end

        #uploads
        uploads = 0
        awsdocuments = organization.awsdocuments.where("created_at >= ? AND created_at <= ?",  date-7.days, date)
        uploads = awsdocuments.count if awsdocuments

        # reports created at begining of the week but shows the data of the whole week
        date = date + 7.days

        secondchart << {date: date.strftime('%Y-%m-%d'), lecturers: lecturers, uploads: uploads, downloads: downloads}
      end
    end
    render json: secondchart.to_json, status: 200
  end

  def nodes
    if @current_subdomain == 'sandbox'
      nodes = @current_organization.nodes.where(name: ['Maths', 'Anglais'])
      render json: nodes, status: 200
    else
      render json: user_nodes, status: 200
    end
  end

end

