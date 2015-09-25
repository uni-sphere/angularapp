class ReportsController < ApplicationController

  def update
    report = current_node.reports.last
    report.increase_downloads
    render json: {res: true}.to_json, status: 200
  end

  def first_chart
    if current_subdomain == 'sandbox'
      firstchart = []
      date = Time.now - 6.months
      t = 0
      for i in 1..28
        firstchart << {date: (date).strftime('%Y-%m-%d'), downloads: rand(10..30)}
        date = date + 7.days
      end
      render json: firstchart.to_json, status: 200
    else
      if !current_node.reports.last.nil?
        firstchart = []
        reports = Report.where(node_id: current_node.id)
        date = reports.last.created_at - 6.months
        @t = 0
        for i in 1..28
          if i > 28 - reports.count
            report = reports[@t]
            firstchart << {date: (report.created_at + 7.days).strftime('%Y-%m-%d'), downloads: report.downloads, id: report.id}
            @t += 1
          else
            firstchart << {date: (reports.first.created_at - (7.days * ((28 - reports.count) - i)) ).strftime('%Y-%m-%d'), downloads: 0}
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
    organization = current_organization
    date = current_organization.created_at

    # first days of creation: set 0 downloads
    secondchart << {date: (date).strftime('%Y-%m-%d'), lecturers: 1, uploads: 0, downloads: 0}
    lecturers = 0

    if current_subdomain == 'sandbox'
      while (date - Time.now).abs > 7.days
        secondchart << {date: date.strftime('%Y-%m-%d'), lecturers: rand(2..5), uploads: rand(5..30), downloads: rand(20..70)}
        date = date + 7.days
      end
    else
      while (Time.now - date ) > 0
        lecturers = organization.users.where(created_at: organization.created_at..date-7.days).count

        #downloads
        downloads = 0
        organization.nodes.where(archived: false).each do |node|
          node.reports.where(created_at: date-7.days..date).each do |report|
            downloads += report.downloads
          end
        end

        #uploads
        uploads = 0
        awsdocuments = organization.awsdocuments.where(created_at: date-7.days..date)
        uploads = awsdocuments.count if awsdocuments

        # reports created at begining of the week but shows the data of the whole week
        date = date + 7.days

        secondchart << {date: (date).strftime('%Y-%m-%d'), lecturers: lecturers, uploads: uploads, downloads: downloads}
      end
    end
    render json: secondchart.to_json, status: 200
  end

  def nodes
    if current_subdomain == 'sandbox'
      res = []
      current_organization.nodes.where(name: ['Maths', 'Anglais'], archived: false).each do |node|
        res << {parent_name: Node.find(node.parent_id).name, name: node.name, id: node.id}
      end
      render json: res.to_json, status: 200
    else
      render json: user_nodes, status: 200
    end
  end

end

