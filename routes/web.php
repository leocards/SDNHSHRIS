<?php

use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GeneralSearchController;
use App\Http\Controllers\IpcrReportController;
use App\Http\Controllers\LeaveController;
use App\Http\Controllers\LocatorSlipController;
use App\Http\Controllers\LogsReportController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PdsCivilServiceController;
use App\Http\Controllers\PdsCs4Controller;
use App\Http\Controllers\PdsEducationalBackgroundController;
use App\Http\Controllers\PdsFamilyBackgroundController;
use App\Http\Controllers\PdsLearningAndDevelopmentController;
use App\Http\Controllers\PdsOtherInformationController;
use App\Http\Controllers\PdsPersonalInformationController;
use App\Http\Controllers\PdsVoluntaryWorkController;
use App\Http\Controllers\PdsWorkExperienceController;
use App\Http\Controllers\PersonalDataSheetController;
use App\Http\Controllers\PersonnelController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SalnController;
use App\Http\Controllers\SalnReportController;
use App\Http\Controllers\SchoolYearController;
use App\Http\Controllers\ServiceRecordController;
use App\Http\Controllers\TardinessController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;

Route::get('/', function () {
    $login = session('title');

    if($login !== "Login")
        if(Auth::check()){
            if(URL::previous() === URL('/'))
                return redirect('/dashboard');
            else
                return back();
        }

    return Inertia::render('Welcome');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('general-search')->middleware(['role:hr,principal'])->group(function () {
        Route::controller(GeneralSearchController::class)->group(function () {
            Route::get('/', 'index')->name('general-search');
            Route::get('/view/{user}', 'view')->name('general-search.view');
            Route::get('/view/locatorslip/view/{ls}', [LocatorSlipController::class, 'view'])->name('general-search.view.ls.view');
        });
    });

    Route::prefix('dashboard')->group(function () {
        Route::controller(DashboardController::class)->group(function () {
            Route::get('/', 'index')->name('dashboard');
            Route::get('/leaveapplication', 'getLeaveapplications')->name('dashboard.leaveapplication');
        });
    });

    Route::prefix('announcement')->group(function () {
        Route::controller(AnnouncementController::class)->group(function () {
            Route::get('/', 'index')->name('announcement');

            Route::post('/store/{user?}', 'store')->middleware(['role:hr'])->name('announcement.store');
            Route::post('/delete/{announcement}', 'destroy')->middleware(['role:hr'])->name('announcement.delete');
        });
    });

    Route::post('/school-year', [SchoolYearController::class, 'store'])->middleware(['role:hr'])->name('school-year.store');
    Route::put('/school-year-update/{schoolYear}', [SchoolYearController::class, 'update'])->middleware(['role:hr'])->name('school-year.update');

    Route::prefix('personnel')->group(function () {
        Route::controller(PersonnelController::class)->group(function () {
            Route::get('/r/{pt}', 'index')->name('personnel');
            Route::get('/create/{pt}/{personnel?}', 'create')->middleware(['role:hr'])->name('personnel.create');
            Route::get('/personnel-archive', 'personnelArchive')->middleware(['role:hr'])->name('personnel.archive');
            Route::get('/personnel-archive/view/{userId}', 'personnelArchiveView')->middleware(['role:hr'])->name('personnel.archive.view');
            Route::get('/personnel-archive/leave/view/{leave}', 'personnelArchiveViewLeaveApplication')->middleware(['role:hr'])->name('personnel.archive.leave.view');
            Route::get('/personnel-archive/view/locatorslip/view/{ls}', [LocatorSlipController::class, 'view'])->middleware(['role:hr'])->name('personnel.archive.view.ls.view');

            Route::post('/new/{personnelid?}', 'store')->middleware(['role:hr'])->name('personnel.store');
            Route::post('/personnel-status/{user}', 'updatePersonnelStatus')->middleware(['role:hr'])->name('personnel.status.update');
        });

        Route::get('/personnel-archive/saln/view/{saln}', [SalnController::class, 'view'])->middleware(['role:hr'])->name('personnel.archive.saln.view');

        // Tardiness routes
        Route::controller(TardinessController::class)->group(function () {
            Route::get('/tardiness', 'index')->name('personnel.tardiness');
            Route::get('/tardiness/personnel-with-tardiness/{sy}/{month}', 'personnelWithoutTardiness')->middleware(['role:hr'])->name('personnel.tardiness.without');

            Route::post('/tardiness/store/{sy}/{month}', 'store')->middleware(['role:hr'])->name('personnel.tardiness.store');
            Route::post('/tardiness/update/{tardiness}', 'update')->middleware(['role:hr'])->name('personnel.tardiness.update');
        });
    });

    Route::prefix('myapproval')->group(function () {
        Route::controller(LeaveController::class)->middleware(['role:hr,principal'])->group(function () {
            Route::get('/leave', 'index')->name('myapproval.leave');
            Route::get('/leave/view/{leave}', 'view')->name('myapproval.leave.view');

            Route::post('/leave/approval/{leave}', 'leaveApproval')->name('myapproval.leave.approval');
        });

        Route::controller(LocatorSlipController::class)->middleware(['role:teaching,non-teaching,principal'])->group(function () {
            Route::get('/locatorslip', 'index')->name('myapproval.locatorslip');
            Route::get('/locatorslip/view/{ls}', 'view')->name('myapproval.locatorslip.view');

            Route::post('/approval/{ls}', 'approval')->name('myapproval.locatorslip.approval');
        });

        Route::controller(PersonalDataSheetController::class)->group(function () {
            Route::get('/pds', 'index')->middleware(['role:hr'])->name('myapproval.pds');
        });

        Route::prefix('saln')->middleware(['role:hr'])->group(function () {
            Route::controller(SalnController::class)->group(function () {
                Route::get('/', 'index')->name('myapproval.saln');
                Route::get('/view/{saln?}', 'view')->name('myapproval.saln.view');

                Route::post('/approval/{saln}', 'approveSaln')->name('myapproval.saln.approval');
            });
        });

        Route::controller(ServiceRecordController::class)->middleware(['role:hr'])->group(function () {
            Route::get('/service-record', 'index')->name('myapproval.sr');
            Route::get('/service-record/view/{sr}', 'view')->name('myapproval.sr.view');

            Route::post('/service-record/respond/{sr}', 'respond')->name('myapproval.sr.respond');
        });
    });

    Route::prefix('myreports')->middleware(['role:hr'])->group(function () {
        Route::controller(PersonnelController::class)->group(function () {
            Route::get('/list-of-personnel', 'ListOfPersonnel')->name('myreports.lp');
        });

        Route::controller(IpcrReportController::class)->group(function () {
            Route::get('/ipcr', 'index')->name('myreports.ipcr');
            Route::get('/ipcr/personnel/not-added/{schoolyearid}', 'personnelWithoutIpcr')->name('myreports.ipcr.personnelWithoutIpcr');

            Route::post('/ipcr/store/{ipcrid?}', 'store')->name('myreports.ipcr.store');
            Route::post('/ipcr/import', 'importIPCR')->name('myreports.ipcr.import');
        });

        Route::controller(SalnReportController::class)->group(function () {
            Route::get('/saln', 'index')->name('myreports.saln');
            Route::get('/saln/personnel/inlisted/{year}', 'personnelWithoutSaln')->name('myreports.saln.personnelWithoutSaln');

            Route::post('/saln/store/{saln?}', 'store')->name('myreports.saln.store');
            Route::post('/saln/import', 'importSALN')->name('myreports.saln.import');
        });

        Route::controller(LogsReportController::class)->group(function () {
            Route::get('/logs', 'index')->name('myreports.logs');
            Route::get('/retrieve-all-logs', 'getAllLogs')->name('myreports.logs.all');
            Route::get('/get-all-years/{type}', 'getYearsOnLogsType')->name('myreports.logs.years');
            Route::get('/get-coc-logs/{coc}', 'getCOCLogs')->name('myreports.logs.coc');
            Route::get('/get-certificate-logs/{certificate}', 'getCertificateLogs')->name('myreports.logs.certificate');
            Route::get('/get-more-records-logs/{userId}', 'getMoreRecords')->name('myreports.logs.more');
        });
    });

    Route::prefix('leave')->middleware(['role:teaching,non-teaching,principal'])->group(function () {
        Route::controller(LeaveController::class)->group(function () {
            Route::get('/', 'index')->name('leave');
            Route::get('/apply', 'apply')->name('leave.apply');
            Route::get('/view/{leave}', 'view')->name('leave.view');

            Route::post('/apply/store', 'store')->name('leave.apply.store');
            Route::post('/submit/medical/{leave}', 'storeMedicalCertificate')->name('leave.medical.store');
        });
    });

    Route::prefix('locatorslip')->middleware(['role:teaching,non-teaching,principal'])->group(function () {
        Route::controller(LocatorSlipController::class)->group(function () {
            Route::get('/', 'index')->name('locatorslip');
            Route::get('/view/{ls}', 'view')->name('locatorslip.view');

            Route::post('/apply', 'store')->name('locatorslip.store');
        });
    });

    Route::prefix('pds')->group(function () {
        Route::controller(PersonalDataSheetController::class)->group(function () {
            Route::get('/', 'index')->middleware(['role:teaching,non-teaching,principal'])->name('pds');
            Route::get('/pds/{userId}', 'pds')->name('pds.pds');

            Route::post('/pds/import/{user}', 'import')->name('pds.import');
            Route::post('/pds/response/{userId}', 'response')->middleware(['role:hr'])->name('pds.response');
        });

        Route::group(['middleware' => ['role:teaching,non-teaching,principal']], function () {
            Route::post('/personal-information', [PdsPersonalInformationController::class, 'store'])->name('pds.store.pi');
            Route::post('/personal-information-update', [PdsPersonalInformationController::class, 'update'])->name('pds.update.pi');

            Route::post('/family-background', [PdsFamilyBackgroundController::class, 'store'])->name('pds.store.fb');
            Route::post('/family-background-update', [PdsFamilyBackgroundController::class, 'update'])->name('pds.update.fb');

            Route::post('/educational-background', [PdsEducationalBackgroundController::class, 'store'])->name('pds.store.eb');
            Route::post('/educational-background-update', [PdsEducationalBackgroundController::class, 'update'])->name('pds.update.eb');

            Route::post('/civil-service-eligibility', [PdsCivilServiceController::class, 'store'])->name('pds.store.cse');
            Route::post('/civil-service-eligibility-update', [PdsCivilServiceController::class, 'update'])->name('pds.update.cse');

            Route::post('/work-experience', [PdsWorkExperienceController::class, 'store'])->name('pds.store.we');
            Route::post('/work-experience-update', [PdsWorkExperienceController::class, 'update'])->name('pds.update.we');

            Route::post('/voluntary-work', [PdsVoluntaryWorkController::class, 'store'])->name('pds.store.vw');
            Route::post('/voluntary-work-update', [PdsVoluntaryWorkController::class, 'update'])->name('pds.update.vw');

            Route::post('/learning-and-development', [PdsLearningAndDevelopmentController::class, 'store'])->name('pds.store.landd');
            Route::post('/learning-and-development-update', [PdsLearningAndDevelopmentController::class, 'update'])->name('pds.update.landd');

            Route::post('/other-information', [PdsOtherInformationController::class, 'store'])->name('pds.store.oi');
            Route::post('/other-information-update', [PdsOtherInformationController::class, 'update'])->name('pds.update.oi');

            Route::post('/c4', [PdsCs4Controller::class, 'store'])->name('pds.store.c4');
            Route::post('/c4-update', [PdsCs4Controller::class, 'update'])->name('pds.update.c4');
        });
    });

    Route::prefix('saln')->middleware(['role:teaching,non-teaching,principal'])->group(function () {
        Route::controller(SalnController::class)->group(function () {
            Route::get('/', 'index')->name('saln');
            Route::get('/new/{saln?}', 'create')->name('saln.create');
            Route::get('/view/{saln?}', 'view')->name('saln.view');
            // Route::get('/spouse', 'getSalnSpouse')->name('saln.spouse');

            Route::post('/save/{saln?}', 'store')->name('saln.store');
        });
    });

    Route::prefix('tardiness')->middleware(['role:teaching,non-teaching'])->group(function () {
        Route::controller(TardinessController::class)->group(function () {
            Route::get('/', 'index')->name('tardiness');
        });
    });

    Route::prefix('service-record')->middleware(['role:teaching,non-teaching,principal'])->group(function () {
        Route::controller(ServiceRecordController::class)->group(function () {
            Route::get('/', 'index')->name('sr');
            Route::get('/view/{sr}', 'view')->name('sr.view');

            Route::post('/', 'store')->name('sr.store');
            Route::post('/storeCOC', 'storeCOC')->name('sr.store.coc');
            Route::post('/temporary-file-upload', 'storeTemporaryFile')->name('sr.temporary');
        });
    });

    Route::prefix('notification')->group(function () {
        Route::controller(NotificationController::class)->group(function () {
            Route::get('/', 'index')->name('notification');
            Route::get('/view/{notification}', 'view')->name('notification.view');
            Route::get('/read/{notification}', 'setNotificationAsRead')->name('notification.read');

            Route::post('/read-all', 'markAllAsRead')->name('notification.read.all');
        });
    });

    Route::prefix('message')->group(function () {
        Route::controller(MessageController::class)->group(function () {
            Route::get('/', 'index')->name('messages');
            Route::get('/search-message', 'searchMessage')->name('messages.search');
            Route::get('/search-new-message', 'searchNewMessage')->name('messages.search.new');
            Route::get('/get-conversations/{user}', 'getUserConversations')->name('messages.conversation');
            Route::get('/search-conversation/{userid}', 'searchConversation')->name('messages.search.conversation');

            Route::post('/delete/{userid}', 'deleteConversation')->name('messages.delete');
            Route::post('/send-message', 'storeMessageConversation')->name('messages.send');
            Route::post('/seen-message/{conversation}', 'markAsSeen')->name('messages.seen');
            Route::post('/seen-all-message', 'markAllAsSeen')->name('messages.seen.all');
        });
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/account', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/account/update', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/account/profilephoto/upload', [ProfileController::class, 'profilePhotoUpload'])->name('profile.profile.upload');
    Route::post('/account/settings', [ProfileController::class, 'settings'])->name('profile.settings');
    Route::delete('/account/delete', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
