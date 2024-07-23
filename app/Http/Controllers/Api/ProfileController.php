<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request)
    {

        $data['president_name'] = 'الرئيس عبد المجيد تبون';
        $data['profile_pic'] = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Abdelmadjid_Tebboune_%282023%29_%28cropped%29.jpg/240px-Abdelmadjid_Tebboune_%282023%29_%28cropped%29.jpg';
        $data['socials'] = [
            [
                'platform' => 'facebook',
                'username' => '@TebbouneAbdelmadjid',
                'link' => 'https://www.facebook.com/TebbouneAbdelmadjid',
                'icon_url' => 'https://cdn-icons-png.flaticon.com/512/20/20673.png'
            ],
            [
                'platform' => 'x',
                'username' => '@TebbouneAmadjid',
                'link' => 'https://x.com/TebbouneAmadjid',
                'icon_url' => 'https://cdn-icons-png.flaticon.com/512/5969/5969020.png'
            ],
        ];
        $data['wiki'] = [
            [
                'title' => null,
                'content' => '
                    <p>
                        عبد المجيد تَبُّون من مواليد 17 نوفمبر 1945 بمدينة المشرية التابعة حاليًا لولاية النعامة؛ سياسي جزائري ورئيس الجمهورية الجزائرية الثامن، كان رئيس وزراء الجزائر الأسبق في حكومة 2017 للفترة من 25 مايو 2017، إلى 15 أغسطس 2017 في عهد الرئيس بوتفليقة ووزير للسكن والعمران في عدة حكومات جزائرية ووزير للاتصال وتبوأ مناصب مختلفة في الدولة . كان في صفوف حزب جبهة التحرير الوطني، لكنه رشح نفسه كمستقل في انتخابات الرئاسة التي فاز فيها حيث حصل على 58% من الأصوات.
                        تولى رئاسة الجمهورية الجزائرية الديمقراطية الشعبية منذ 19 ديسمبر 2019. مرشح مستقل وهو عضو في جبهة التحرير الوطني التي لا تدعمه رسميا، فاز في الجولة الأولى من الانتخابات الرئاسية 2019، والتي تميزت بامتناع قياسي عن التصويت. وشهدت بداية ولايته استمرار مظاهرات الحراك الحاشدة، ثم اضطر بعد ذلك إلى إدارة جائحة كوفيد-19.
                    </p>
                '
            ],
            [
                'title' => 'النشأة',
                'content' => '
                <p>
وُلِدَ في مدينة المشرية بولاية النعامة في 17 نوفمبر 1945، وهو ابن الحاج أحمد تبون، والدته هي فاطمة عفان.
                    </p>
                    '
            ],
            [
                'title' => 'سيرة',
                'content' => '
                    <p>
                    تخرج من المدرسة الوطنية للإدارة، في اختصاص اقتصاد ومالية 1965، الدفعة الثانية في جويلية 1969. وشغل عدة وظائف سياسية وبرلمانية ووزارية وهي:
                    </p>
                    <ul>
                        <li>1975 ـ 1992: إطار على مستوى الجماعات المحلية.</li>
                        <li>أمين عام لكل من ولايات <span>أدرار</span>، <span>باتنة</span> <span>والمسيلة</span>، ووالي لكل من ولايات <span>الجلفة</span>، <span>أدرار</span>، <span>تيارت</span>، <span>وتيزي وزو</span>؛</li>
                        <li>1991 ـ 1992: وزير منتدب بالجماعات المحلية.</li>
                        <li>1999: وزير السكن والعمران.</li>
                        <li>1991 ـ 2000: وزير الاتصال.</li>
                        <li>2000 ـ 2001: وزير منتدب بالجماعات المحلية.</li>
                        <li>2001 ـ 2002: وزير السكن والعمران.</li>
                        <li>2012 ـ 2013: وزير السكن والعمران.</li>
                        <li>2013 ـ 2017: وزير السكن والعمران والمدينة.</li>
                        <li>2017: مكلف بمهام وزير التجارة بالنيابة.</li>
                        <li>25 ماي <span>2017</span>: وزير أول للحكومة، أنهى رئيس الجمهورية مهامه في <span >15 أوت</span> <span>2017</span>.<sup><span>[13]</span></sup></li>
                    </ul>
                '
            ]
        ];

        $data['html'] = '
        <section class="accordion">
                <div class="tab">
                    <input type="checkbox" name="accordion-1" id="cb1" checked>
                    <label for="cb1" class="tab__label">Checkbox</label>
                    <div class="tab__content">
                    <p>Pure CSS accordion based on the "input:checked + label" style trick.</p>
                    </div>
                </div>
                <div class="tab">
                    <input type="checkbox" name="accordion-1" id="cb2">
                    <label for="cb2" class="tab__label">Open multiple</label>
                    <div class="tab__content">
                    <p>Using <code>&lt;input type="checkbox"&gt;</code> allows to have several tabs open at the same time.</p>
                    </div>
                </div>
                </section>

                <section class="accordion accordion--radio">
                <div class="tab">
                    <input type="radio" name="accordion-2" id="rd1">
                    <label for="rd1" class="tab__label">Radio</label>
                    <div class="tab__content">
                    <p>If you want to have only one tab open, you can use <code>&lt;input type="checkbox"&gt;</code>.</p>
                    </div>
                </div>
                <div class="tab">
                    <input type="radio" name="accordion-2" id="rd2">
                    <label for="rd2" class="tab__label">Open single</label>
                    <div class="tab__content">
                    <p>But if you wanna close the opened tab, you must add a "close" button somewhere, like the one below, that is just another styled radio input.</p>
                    </div>
                </div>
                <div class="tab">
                    <input type="radio" name="accordion-2" id="rd3">
                    <label for="rd3" class="tab__close">Close open tab &times;</label>
                </div>
                </section>
                <style>
                :root {
                --primary: #227093;
                --secondary: #ff5252;
                --background: #eee;
                --highlight: #ffda79;
                /* Theme color */
                --theme: var(--primary);
                }
                *, *::before, *::after {
                box-sizing: border-box;
                }
                body {
                display: grid;
                place-content: center;
                grid-template-columns: repeat(auto-fit, min(100%, 30rem));
                min-height: 100vh;
                place-items: start;
                gap: 1rem;
                margin: 0;
                padding: 1rem;
                color: var(--primary);
                background: var(--background);
                }

                /* Core styles/functionality */
                .tab input {
                position: absolute;
                opacity: 0;
                z-index: -1;
                }
                .tab__content {
                max-height: 0;
                overflow: hidden;
                transition: all 0.35s;
                }
                .tab input:checked ~ .tab__content {
                max-height: 10rem;
                }

                /* Visual styles */
                .accordion {
                color: var(--theme);
                border: 2px solid;
                border-radius: 0.5rem;
                overflow: hidden;
                }
                .tab__label,
                .tab__close {
                display: flex;
                color: white;
                background: var(--theme);
                cursor: pointer;
                }
                .tab__label {
                justify-content: space-between;
                padding: 1rem;
                }
                .tab__label::after {
                content: "\276F";
                width: 1em;
                height: 1em;
                text-align: center;
                transform: rotate(90deg);
                transition: all 0.35s;
                }
                .tab input:checked + .tab__label::after {
                transform: rotate(270deg);
                }
                .tab__content p {
                margin: 0;
                padding: 1rem;
                }
                .tab__close {
                justify-content: flex-end;
                padding: 0.5rem 1rem;
                font-size: 0.75rem;
                }
                .accordion--radio {
                --theme: var(--secondary);
                }

                /* Arrow animation */
                .tab input:not(:checked) + .tab__label:hover::after {
                animation: bounce .5s infinite;
                }
                @keyframes bounce {
                25% {
                    transform: rotate(90deg) translate(.25rem);
                }
                75% {
                    transform: rotate(90deg) translate(-.25rem);
                }
                }

                </style>
                ';


        return response()->json([
            'socials' => $data['socials'],
            'wiki' => $data['wiki'],
            'profile_pic' => $data['profile_pic'],
            'president_name' => $data['president_name'],
            'html' => $data['html'],
        ]);
    }
}
