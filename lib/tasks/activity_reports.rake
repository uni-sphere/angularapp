namespace :activity_reports do
  desc "send"
  task send: :environment do
    User.send_activity_reports 
    Node.create_reports
  end
end