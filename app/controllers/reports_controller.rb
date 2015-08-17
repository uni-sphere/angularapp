class ReportsController < ApplicationController
  
  def update
    report = current_node.reports.last
    report.increase_downloads
  end
  
  def first_chart
    if !current_node.reports.last.nil?
      firstchart = []
      reports = current_node.reports
      date = reports.last.created_at - 6.months
      t = 0
      for i in 1..28
        if i > 28 - reports.count
          report = reports[t]
          firstchart << {date: (date).strftime('%Y-%m-%d'), downloads: report.downloads}
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
  
  def second_chart
    secondchart = []
    
    organization = current_organization
    
    date = current_organization.created_at
    
    # first days of creation: set 0 downloads
    secondchart << {date: date.strftime('%Y-%m-%d'), lecturers: 1, uploads: 0, downloads: 0}
    lecturers = 0
    
    if current_subdomain == 'sandbox'
      while (date - Time.now).abs > 7.days
        secondchart << {date: date.strftime('%Y-%m-%d'), lecturers: t, uploads: rand(5..30), downloads: rand(20..70)}
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
    enddef user_nodes
    if Chapter.exists?(user_id: current_user.id)
      chapters = Chapter.where(user_id: current_user.id)
      ids = []
      chapters.each do |chapter|
        ids << chapter.node_id if Chapter.where(node_id: chapter.node_id).count > 1 || chapter.awsdocuments.count > 0
      end
      if Node.exists?(id: ids)
        return Node.where(id: ids)
      else
        return {}
      end
    else
      return {}
    end
  end
    render json: secondchart.to_json, status: 200
  end
  
  def nodes
    render json: user_nodes, status: 200
  end
  
end